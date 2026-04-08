import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { resetCommonMocks } from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import RozkladGodzinPage from "../app/dashboard/administratorSzkoly/rozklad-godzin/page";

describe("RozkladGodzinPage", () => {
  beforeEach(() => {
    resetCommonMocks();
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValue({
      data: [
        { id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" },
        { id: "lt-2", lessonStart: "09:00:00", lessonEnd: "09:45:00" },
      ],
    } as any);
  });

  test("renders lesson times list", async () => {
    render(<RozkladGodzinPage />);

    await waitFor(() =>
      expect(screen.getByText(/Lekcja 1/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/08:00 - 08:45/i)).toBeInTheDocument();
    expect(screen.getByText(/09:00 - 09:45/i)).toBeInTheDocument();
  });

  test("validates and adds lesson time", async () => {
    vi.mocked(api.createLessonTime).mockResolvedValueOnce({} as any);

    render(<RozkladGodzinPage />);

    await waitFor(() =>
      expect(screen.getByText(/Lekcja 1/i)).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Dodaj godzinę lekcyjną/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /^Dodaj$/i }));

    await waitFor(() =>
      expect(screen.getByText(/Wypełnij wszystkie pola/i)).toBeInTheDocument(),
    );

    const timeInputs = screen.getAllByDisplayValue("");
    fireEvent.change(timeInputs[0], { target: { value: "10:00" } });
    fireEvent.change(timeInputs[1], { target: { value: "10:45" } });

    fireEvent.click(screen.getByRole("button", { name: /^Dodaj$/i }));

    await waitFor(() =>
      expect(api.createLessonTime).toHaveBeenCalledWith({
        schoolId: "school-1",
        lessonStart: "10:00",
        lessonEnd: "10:45",
      }),
    );
  });

  test("edits lesson time", async () => {
    vi.mocked(api.updateLessonTime).mockResolvedValueOnce({} as any);

    render(<RozkladGodzinPage />);

    await waitFor(() =>
      expect(screen.getByText(/Lekcja 1/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getAllByRole("button", { name: /Edytuj/i })[0]);

    const editInputs = screen.getAllByDisplayValue(/08:00:00|08:45:00/i);
    fireEvent.change(editInputs[0], { target: { value: "08:10" } });
    fireEvent.change(editInputs[1], { target: { value: "08:55" } });

    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(api.updateLessonTime).toHaveBeenCalledWith("lt-1", {
        lessonStart: "08:10",
        lessonEnd: "08:55",
      }),
    );
  });

  test("deletes lesson time when confirmed", async () => {
    vi.mocked(api.deleteLessonTime).mockResolvedValueOnce({} as any);
    global.confirm = vi.fn(() => true);

    render(<RozkladGodzinPage />);

    await waitFor(() =>
      expect(screen.getByText(/Lekcja 1/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getAllByRole("button", { name: /Usuń/i })[0]);

    await waitFor(() =>
      expect(api.deleteLessonTime).toHaveBeenCalledWith("lt-1"),
    );
  });

  test("shows missing school error", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<RozkladGodzinPage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak informacji o szkole/i)).toBeInTheDocument(),
    );
  });
});
