import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useProtectedRouteMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import RodzicFrekwencjaPage from "../app/dashboard/rodzic/frekwencja/page";
import RodzicOcenyPage from "../app/dashboard/rodzic/oceny/page";
import UczenFrekwencjaPage from "../app/dashboard/uczen/frekwencja/page";

describe("RodzicFrekwencjaPage branch coverage", () => {
  beforeEach(() => {
    resetCommonMocks();
    localStorage.clear();

    useProtectedRouteMock.mockReturnValue({
      user: { id: "parent-1", schoolId: "school-1" },
      isAuthorized: true,
      isLoading: false,
    });
    vi.mocked(auth.getUserFromStorage).mockReturnValue({
      id: "parent-1",
      schoolId: "school-1",
    } as any);

    vi.mocked(api.getAllStudents).mockClear();
    vi.mocked(api.getLessonTimesBySchoolId).mockClear();
    vi.mocked(api.getAttendancesByStudentId).mockClear();
  });

  test("shows parent info error when user id is missing", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<RodzicFrekwencjaPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak informacji o rodzicu/i),
      ).toBeInTheDocument(),
    );
  });

  test("shows student fetch error branch", async () => {
    vi.mocked(api.getAllStudents).mockRejectedValueOnce(new Error("fail"));

    render(<RodzicFrekwencjaPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Błąd podczas pobierania uczniów/i),
      ).toBeInTheDocument(),
    );
  });

  test("uses saved selected student and handles student switch", async () => {
    localStorage.setItem("selectedStudentId", "st-2");

    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          schoolId: "school-1",
          firstName: "Jan",
          lastName: "Nowak",
        },
        {
          schoolMemberId: "st-2",
          schoolId: "school-1",
          firstName: "Anna",
          lastName: "Nowak",
        },
      ],
    } as any);

    vi.mocked(api.getLessonTimesBySchoolId)
      .mockResolvedValueOnce({
        data: [
          { id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" },
          { id: "lt-2", lessonStart: "08:50:00", lessonEnd: "09:35:00" },
        ],
      } as any)
      .mockResolvedValueOnce({
        data: [
          { id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" },
          { id: "lt-2", lessonStart: "08:50:00", lessonEnd: "09:35:00" },
        ],
      } as any);

    vi.mocked(api.getAttendancesByStudentId)
      .mockResolvedValueOnce({
        data: [
          {
            id: "a-1",
            lessonDate: "2026-03-10",
            lessonTimeId: "lt-1",
            attendanceStatus: "ABSENT",
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        data: [
          {
            id: "a-2",
            lessonDate: "2026-03-11",
            lessonTimeId: "lt-1",
            attendanceStatus: "PRESENT",
          },
        ],
      } as any);

    render(<RodzicFrekwencjaPage />);

    await waitFor(() =>
      expect(api.getAttendancesByStudentId).toHaveBeenCalledWith("st-2"),
    );
    expect(screen.getByText("nb")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "st-1" },
    });

    await waitFor(() =>
      expect(api.getAttendancesByStudentId).toHaveBeenCalledWith("st-1"),
    );
    await waitFor(() => expect(screen.getByText("ob")).toBeInTheDocument());
    expect(localStorage.getItem("selectedStudentId")).toBe("st-1");
  });

  test("shows attendance fetch error branch", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          schoolId: "school-1",
          firstName: "Jan",
          lastName: "Nowak",
        },
      ],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockRejectedValueOnce(
      new Error("lesson times failed"),
    );

    render(<RodzicFrekwencjaPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Błąd podczas pobierania frekwencji/i),
      ).toBeInTheDocument(),
    );
  });
});

describe("RodzicOcenyPage branch coverage", () => {
  beforeEach(() => {
    resetCommonMocks();
    localStorage.clear();

    useProtectedRouteMock.mockReturnValue({
      user: { id: "parent-1", schoolId: "school-1" },
      isAuthorized: true,
      isLoading: false,
    });
    vi.mocked(auth.getUserFromStorage).mockReturnValue({
      id: "parent-1",
      schoolId: "school-1",
    } as any);

    vi.mocked(api.getAllStudents).mockClear();
    vi.mocked(api.getAllGrades).mockClear();
    vi.mocked(api.getSubjectsBySchoolId).mockClear();
  });

  test("shows parent info error when user id is missing", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<RodzicOcenyPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak informacji o rodzicu/i),
      ).toBeInTheDocument(),
    );
  });

  test("shows no assigned students branch", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({ data: [] } as any);

    render(<RodzicOcenyPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak przypisanych uczniów/i),
      ).toBeInTheDocument(),
    );
  });

  test("shows grades fetch error branch", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          schoolId: "school-1",
          firstName: "Jan",
          lastName: "Nowak",
        },
      ],
    } as any);
    vi.mocked(api.getAllGrades).mockRejectedValueOnce(new Error("grades fail"));

    render(<RodzicOcenyPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Blad podczas pobierania ocen/i),
      ).toBeInTheDocument(),
    );
  });

  test("uses subject fallback and handles student change", async () => {
    localStorage.setItem("selectedStudentId", "st-2");

    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          schoolId: "school-1",
          firstName: "Jan",
          lastName: "Nowak",
        },
        {
          schoolMemberId: "st-2",
          schoolId: "school-1",
          firstName: "Anna",
          lastName: "Nowak",
        },
      ],
    } as any);

    vi.mocked(api.getAllGrades)
      .mockResolvedValueOnce({
        data: [
          {
            id: "g-1",
            subjectId: "sub-404",
            gradeType: "REGULAR_SEMESTER_1",
            gradeValue: "FIVE",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    vi.mocked(api.getSubjectsBySchoolId)
      .mockResolvedValueOnce({ data: [] } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    render(<RodzicOcenyPage />);

    await waitFor(() => expect(api.getAllGrades).toHaveBeenCalledWith("st-2"));
    expect(screen.getByText("sub-404")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "st-1" },
    });

    await waitFor(() => expect(api.getAllGrades).toHaveBeenCalledWith("st-1"));
    await waitFor(() =>
      expect(
        screen.getByText(/Brak ocen do wyswietlenia/i),
      ).toBeInTheDocument(),
    );
    expect(localStorage.getItem("selectedStudentId")).toBe("st-1");
  });
});

describe("UczenFrekwencjaPage branch coverage", () => {
  beforeEach(() => {
    resetCommonMocks();
    localStorage.clear();

    useProtectedRouteMock.mockReturnValue({
      user: { id: "student-1", schoolId: "school-1" },
      isAuthorized: true,
      isLoading: false,
    });
    vi.mocked(auth.getUserFromStorage).mockReturnValue({
      id: "student-1",
      schoolId: "school-1",
    } as any);

    vi.mocked(api.getLessonTimesBySchoolId).mockClear();
    vi.mocked(api.getAttendancesByStudentId).mockClear();
  });

  test("shows student info error when id or school is missing", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce({
      id: "student-1",
    } as any);

    render(<UczenFrekwencjaPage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak informacji o uczniu/i)).toBeInTheDocument(),
    );
  });

  test("shows attendance fetch error branch", async () => {
    vi.mocked(api.getLessonTimesBySchoolId).mockRejectedValueOnce(
      new Error("lesson fail"),
    );

    render(<UczenFrekwencjaPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Błąd podczas pobierania frekwencji/i),
      ).toBeInTheDocument(),
    );
  });

  test("renders attendance grid with status cells and empty cells", async () => {
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [
        { id: "lt-2", lessonStart: "08:50:00", lessonEnd: "09:35:00" },
        { id: "lt-1", lessonStart: "08:00:00", lessonEnd: "08:45:00" },
        { id: "lt-3", lessonStart: "09:40:00", lessonEnd: "10:25:00" },
      ],
    } as any);
    vi.mocked(api.getAttendancesByStudentId).mockResolvedValueOnce({
      data: [
        {
          id: "a-1",
          lessonDate: "2026-02-11",
          lessonTimeId: "lt-1",
          attendanceStatus: "PRESENT",
        },
        {
          id: "a-2",
          lessonDate: "2026-02-11",
          lessonTimeId: "lt-2",
          attendanceStatus: "UNKNOWN",
        },
      ],
    } as any);

    render(<UczenFrekwencjaPage />);

    await waitFor(() => expect(screen.getByText("ob")).toBeInTheDocument());
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText(/Frekwencja/i)).toBeInTheDocument();
  });
});
