import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useProtectedRouteMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import NauczycielFrekwencjaPage from "../app/dashboard/nauczyciel/frekwencja/page";
import NauczycielOcenyPage from "../app/dashboard/nauczyciel/oceny/page";
import NauczycielPlanZajecPage from "../app/dashboard/nauczyciel/plan-zajec/page";

describe("Teacher attendance grades and plan pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    useProtectedRouteMock.mockReturnValue({
      user: { id: "t-1", schoolId: "school-1", login: "teacher" },
      isAuthorized: true,
      isLoading: false,
    });
    vi.mocked(auth.getUserFromStorage).mockReturnValue({
      id: "t-1",
      schoolId: "school-1",
      login: "teacher",
    } as any);
  });

  test("frekwencja page confirms selection and saves new attendance", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C" }],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "lt-1", lessonStart: "08:00", lessonEnd: "08:45" }],
    } as any);
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          firstName: "Jan",
          lastName: "Kowalski",
        },
      ],
    } as any);
    vi.mocked(api.getAttendancesByStudentId).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<NauczycielFrekwencjaPage />);

    await waitFor(() =>
      expect(screen.getByText(/Frekwencja/i)).toBeInTheDocument(),
    );

    const topSelects = screen.getAllByRole("combobox");
    fireEvent.change(topSelects[0], { target: { value: "c-1" } });
    fireEvent.change(topSelects[1], { target: { value: "lt-1" } });
    fireEvent.change(screen.getByDisplayValue(""), {
      target: { value: "2026-04-08" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Zatwierdź wybór/i }));

    await waitFor(() =>
      expect(screen.getByText(/Lista obecności/i)).toBeInTheDocument(),
    );

    vi.mocked(api.createAttendance).mockResolvedValue({} as any);
    fireEvent.click(
      screen.getByRole("button", { name: /Zatwierdź listę obecności/i }),
    );

    await waitFor(() =>
      expect(api.createAttendance).toHaveBeenCalledWith(
        expect.objectContaining({
          teacherId: "t-1",
          studentId: "st-1",
          lessonTimeId: "lt-1",
          lessonDate: "2026-04-08",
        }),
      ),
    );
  });

  test("frekwencja page edits existing attendance", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C" }],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "lt-1", lessonStart: "08:00", lessonEnd: "08:45" }],
    } as any);
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          firstName: "Jan",
          lastName: "Kowalski",
        },
      ],
    } as any);
    vi.mocked(api.getAttendancesByStudentId).mockResolvedValueOnce({
      data: [
        {
          id: "a-1",
          lessonTimeId: "lt-1",
          lessonDate: "2026-04-08",
          attendanceStatus: "PRESENT",
        },
      ],
    } as any);
    vi.mocked(api.updateAttendance).mockResolvedValue({} as any);

    render(<NauczycielFrekwencjaPage />);

    await waitFor(() =>
      expect(screen.getByText(/Frekwencja/i)).toBeInTheDocument(),
    );

    const topSelects = screen.getAllByRole("combobox");
    fireEvent.change(topSelects[0], { target: { value: "c-1" } });
    fireEvent.change(topSelects[1], { target: { value: "lt-1" } });
    fireEvent.change(screen.getByDisplayValue(""), {
      target: { value: "2026-04-08" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zatwierdź wybór/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Istniejąca lista obecności/i),
      ).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Edytuj listę obecności/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Zaktualizuj listę obecności/i }),
    );

    await waitFor(() =>
      expect(api.updateAttendance).toHaveBeenCalledWith(
        "a-1",
        expect.objectContaining({ teacherId: "t-1" }),
      ),
    );
  });

  test("oceny page adds grade", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          schoolId: "school-1",
          schoolClassId: "c-1",
          firstName: "Jan",
          lastName: "Kowalski",
        },
      ],
    } as any);
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C" }],
    } as any);
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [{ id: "sub-1", name: "Matematyka" }],
    } as any);
    vi.mocked(api.getAllGrades)
      .mockResolvedValueOnce({ data: [] } as any)
      .mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(api.createGrade).mockResolvedValueOnce({} as any);

    render(<NauczycielOcenyPage />);

    await waitFor(() =>
      expect(screen.getByText(/Oceny uczniow/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: /Jan\s+Kowalski/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Dodaj ocene/i }));

    await waitFor(() =>
      expect(api.createGrade).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: "st-1",
          teacherId: "t-1",
          subjectId: "sub-1",
        }),
      ),
    );
  });

  test("oceny page edits then deletes grade", async () => {
    const gradeRecord = {
      id: "g-1",
      subjectId: "sub-1",
      gradeType: "REGULAR_SEMESTER_1",
      gradeValue: "FIVE",
      weight: 1,
      countToAverage: true,
      description: "",
      createdAt: new Date().toISOString(),
    };

    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          schoolId: "school-1",
          schoolClassId: "c-1",
          firstName: "Jan",
          lastName: "Kowalski",
        },
      ],
    } as any);
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C" }],
    } as any);
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [{ id: "sub-1", name: "Matematyka" }],
    } as any);
    vi.mocked(api.getAllGrades)
      .mockResolvedValueOnce({ data: [gradeRecord] } as any)
      .mockResolvedValueOnce({ data: [gradeRecord] } as any)
      .mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(api.deleteGrade).mockResolvedValueOnce({} as any);
    global.confirm = vi.fn(() => true);

    render(<NauczycielOcenyPage />);

    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: /Jan\s+Kowalski/i }),
      ).toBeInTheDocument(),
    );
    await waitFor(() => expect(api.getAllGrades).toHaveBeenCalledWith("st-1"));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /^5$/i })).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /^5$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Usun$/i }));

    await waitFor(() => expect(api.deleteGrade).toHaveBeenCalledWith("g-1"));
  });

  test("plan zajec page renders teacher schedule", async () => {
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [{ id: "sub-1", name: "Matematyka" }],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" }],
    } as any);
    vi.mocked(api.getAllLessonsByTeacherId).mockResolvedValueOnce({
      data: [
        {
          id: "l-1",
          teacherId: "t-1",
          schoolClassId: "c-1",
          subjectId: "sub-1",
          lessonTimeId: "lt-1",
          day: "MONDAY",
          room: "12",
        },
      ],
    } as any);
    vi.mocked(api.getSchoolClassById).mockResolvedValueOnce({
      data: { id: "c-1", name: "7C" },
    } as any);

    render(<NauczycielPlanZajecPage />);

    await waitFor(() =>
      expect(screen.getByText(/Mój Plan Zajęć/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Matematyka/i)).toBeInTheDocument();
    expect(screen.getByText(/7C/i)).toBeInTheDocument();
    expect(screen.getByText(/sala 12/i)).toBeInTheDocument();
  });

  test("plan zajec page shows missing teacher info error", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<NauczycielPlanZajecPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak informacji o nauczycielu lub szkole/i),
      ).toBeInTheDocument(),
    );
  });
});
