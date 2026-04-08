import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useProtectedRouteMock,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import UczenProfilPage from "../app/dashboard/uczen/profil/page";
import UczenInformacjeOSzkolePage from "../app/dashboard/uczen/informacje-o-szkole/page";
import UczenOcenyPage from "../app/dashboard/uczen/oceny/page";
import UczenFrekwencjaPage from "../app/dashboard/uczen/frekwencja/page";
import UczenPlanZajecPage from "../app/dashboard/uczen/plan-zajec/page";

describe("Uczen pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    useProtectedRouteMock.mockReturnValue({
      user: { id: "st-1", schoolId: "school-1", login: "student" },
      isAuthorized: true,
      isLoading: false,
    });
    vi.mocked(auth.getUserFromStorage).mockReturnValue({
      id: "st-1",
      schoolId: "school-1",
      login: "student",
    } as any);
  });

  test("profil updates login and logs out", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "st-1", login: "studentOld" },
    } as any);
    vi.mocked(api.updateUser).mockResolvedValueOnce({
      data: { id: "st-1", login: "studentNew" },
    } as any);

    render(<UczenProfilPage />);

    await waitFor(() =>
      expect(screen.getByText("studentOld")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));
    fireEvent.change(screen.getByDisplayValue("studentOld"), {
      target: { value: "studentNew" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("st-1", {
        login: "studentNew",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: /Wyloguj/i }));
    expect(auth.clearUserFromStorage).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("informacje-o-szkole handles missing school", async () => {
    useProtectedRouteMock.mockReturnValue({
      user: { id: "st-1" },
      isAuthorized: true,
      isLoading: false,
    });

    render(<UczenInformacjeOSzkolePage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak przypisanej szkoły/i)).toBeInTheDocument(),
    );
  });

  test("oceny renders student grades", async () => {
    vi.mocked(api.getAllGrades).mockResolvedValueOnce({
      data: [
        {
          id: "g-1",
          subjectId: "sub-1",
          gradeType: "REGULAR_SEMESTER_1",
          gradeValue: "FIVE",
          createdAt: new Date().toISOString(),
        },
      ],
    } as any);
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [{ id: "sub-1", name: "Matematyka" }],
    } as any);

    render(<UczenOcenyPage />);

    await waitFor(() => expect(screen.getByText(/Oceny/i)).toBeInTheDocument());
    expect(screen.getByText(/Matematyka/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("frekwencja shows empty state when no attendance", async () => {
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAttendancesByStudentId).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<UczenFrekwencjaPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak danych frekwencji do wyświetlenia/i),
      ).toBeInTheDocument(),
    );
  });

  test("plan-zajec handles missing class assignment", async () => {
    vi.mocked(api.getStudentById).mockResolvedValueOnce({
      data: { id: "st-1", schoolClassId: null },
    } as any);

    render(<UczenPlanZajecPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Uczeń nie ma przypisanej klasy/i),
      ).toBeInTheDocument(),
    );
  });

  test("plan-zajec renders lesson grid", async () => {
    vi.mocked(api.getStudentById).mockResolvedValueOnce({
      data: { id: "st-1", schoolClassId: "c-1" },
    } as any);
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [{ id: "sub-1", name: "Matematyka" }],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" }],
    } as any);
    vi.mocked(api.getAllLessonsBySchoolClassId).mockResolvedValueOnce({
      data: [
        {
          id: "l-1",
          schoolClassId: "c-1",
          teacherId: "t-1",
          subjectId: "sub-1",
          lessonTimeId: "lt-1",
          room: "22",
          day: "MONDAY",
        },
      ],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Piotr", lastName: "Nowak" }],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    render(<UczenPlanZajecPage />);

    await waitFor(() =>
      expect(screen.getByText(/Mój Plan Zajęć/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Matematyka/i)).toBeInTheDocument();
    expect(screen.getByText(/Piotr Nowak/i)).toBeInTheDocument();
    expect(screen.getByText(/sala 22/i)).toBeInTheDocument();
  });
});
