import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import PlanLekcjiPage from "../app/dashboard/administratorSzkoly/klasy/[id]/plan-lekcji/page";

describe("PlanLekcjiPage", () => {
  beforeEach(() => {
    resetCommonMocks();
    vi.mocked(api.getSchoolClassById).mockResolvedValue({
      data: {
        id: "class-1",
        schoolId: "school-1",
        name: "7C",
        homeroomTeacherId: "t-1",
      },
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValue({
      data: [
        { userId: "t-1", firstName: "Jan", lastName: "Kowalski" },
        { userId: "t-2", firstName: "Anna", lastName: "Nowak" },
      ],
    } as any);
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValue({
      data: [{ id: "s-1", name: "Matematyka" }],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValue({
      data: [{ id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" }],
    } as any);
    vi.mocked(api.getAllLessonsBySchoolClassId).mockResolvedValue({
      data: [],
    } as any);
  });

  test("shows empty schedule and validates create form", async () => {
    render(<PlanLekcjiPage />);

    await waitFor(() =>
      expect(screen.getByText(/Plan lekcji: 7C/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Brak lekcji w planie/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Dodaj lekcję do planu/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(screen.getByText(/Wypełnij wszystkie pola/i)).toBeInTheDocument(),
    );
  });

  test("creates lesson from add form", async () => {
    vi.mocked(api.createLesson).mockResolvedValueOnce({} as any);

    render(<PlanLekcjiPage />);

    await waitFor(() =>
      expect(screen.getByText(/Plan lekcji: 7C/i)).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Dodaj lekcję do planu/i }),
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], {
      target: { value: "t-2" },
    });
    fireEvent.change(selects[1], {
      target: { value: "s-1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/np. 101/i), {
      target: { value: "101" },
    });
    fireEvent.change(selects[3], {
      target: { value: "lt-1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(api.createLesson).toHaveBeenCalledWith({
        teacherId: "t-2",
        schoolClassId: "class-1",
        subjectId: "s-1",
        room: "101",
        lessonTimeId: "lt-1",
        day: "MONDAY",
      }),
    );
    await waitFor(() =>
      expect(screen.getByText(/Lekcja dodana pomyślnie/i)).toBeInTheDocument(),
    );
  });

  test("edits and deletes existing lesson", async () => {
    vi.mocked(api.getAllLessonsBySchoolClassId).mockResolvedValue({
      data: [
        {
          id: "lesson-1",
          teacherId: "t-1",
          schoolClassId: "class-1",
          subjectId: "s-1",
          room: "101",
          lessonTimeId: "lt-1",
          day: "MONDAY",
        },
      ],
    } as any);
    vi.mocked(api.updateLesson).mockResolvedValue({} as any);
    vi.mocked(api.deleteLesson).mockResolvedValue({} as any);

    render(<PlanLekcjiPage />);

    await waitFor(() =>
      expect(screen.getByText(/Matematyka/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Matematyka/i));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Zapisz zmiany/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByDisplayValue("101"), {
      target: { value: "202" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(api.updateLesson).toHaveBeenCalledWith(
        "lesson-1",
        expect.objectContaining({ room: "202" }),
      ),
    );

    fireEvent.click(screen.getByText(/Matematyka/i));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Usuń lekcję/i }),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Usuń lekcję/i }));

    await waitFor(() =>
      expect(api.deleteLesson).toHaveBeenCalledWith("lesson-1"),
    );
  });

  test("shows school missing error and supports back navigation", async () => {
    const backMock = vi.fn();
    useRouterMock.mockReturnValue({ push: vi.fn(), back: backMock });
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<PlanLekcjiPage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak informacji o szkole/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Wróć/i }));
    expect(backMock).toHaveBeenCalled();
  });
});
