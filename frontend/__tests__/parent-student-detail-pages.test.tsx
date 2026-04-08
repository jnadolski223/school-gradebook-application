import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

import { resetCommonMocks } from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";

import RodzicFrekwencjaDetailPage from "../app/dashboard/rodzic/frekwencja/[id]/page";
import RodzicOcenaDetailsPage from "../app/dashboard/rodzic/oceny/[id]/page";
import UczenFrekwencjaDetailPage from "../app/dashboard/uczen/frekwencja/[id]/page";
import UczenOcenaDetailsPage from "../app/dashboard/uczen/oceny/[id]/page";

const reactUseSpy = vi.spyOn(React, "use");

afterAll(() => {
  reactUseSpy.mockRestore();
});

beforeEach(() => {
  resetCommonMocks();
  reactUseSpy.mockReturnValue({ id: "detail-1" } as any);

  vi.mocked(api.getAttendanceById).mockReset();
  vi.mocked(api.getGradeById).mockReset();
  vi.mocked(api.getSubjectById).mockReset();
  vi.mocked(api.getSchoolMemberById).mockReset();
});

describe("Parent and student details pages", () => {
  test("rodzic frekwencja details renders attendance and teacher", async () => {
    vi.mocked(api.getAttendanceById).mockResolvedValueOnce({
      data: {
        id: "a-1",
        lessonDate: "2026-01-15T00:00:00.000Z",
        attendanceStatus: "JUSTIFIED",
        teacherId: "t-1",
        createdAt: "2026-01-15T08:00:00.000Z",
        modifiedAt: "2026-01-15T10:00:00.000Z",
      },
    } as any);
    vi.mocked(api.getSchoolMemberById).mockResolvedValueOnce({
      data: { userId: "t-1", firstName: "Anna", lastName: "Nowak" },
    } as any);

    render(
      <RodzicFrekwencjaDetailPage params={Promise.resolve({ id: "a-1" })} />,
    );

    await waitFor(() =>
      expect(screen.getByText(/Szczegóły frekwencji/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Usprawiedliwiony/i)).toBeInTheDocument();
    expect(screen.getByText(/Anna Nowak/i)).toBeInTheDocument();
    expect(screen.getByText(/Powrót do frekwencji/i)).toBeInTheDocument();
  });

  test("rodzic frekwencja details shows error on fetch failure", async () => {
    vi.mocked(api.getAttendanceById).mockRejectedValueOnce(new Error("boom"));

    render(
      <RodzicFrekwencjaDetailPage params={Promise.resolve({ id: "a-1" })} />,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/Błąd podczas pobierania szczegółów frekwencji/i),
      ).toBeInTheDocument(),
    );
  });

  test("uczen frekwencja details renders without teacher when teacherId is missing", async () => {
    vi.mocked(api.getAttendanceById).mockResolvedValueOnce({
      data: {
        id: "a-2",
        lessonDate: "2026-02-10T00:00:00.000Z",
        attendanceStatus: "LATE",
        teacherId: "",
        createdAt: "2026-02-10T08:00:00.000Z",
        modifiedAt: "2026-02-10T09:00:00.000Z",
      },
    } as any);

    render(
      <UczenFrekwencjaDetailPage params={Promise.resolve({ id: "a-2" })} />,
    );

    await waitFor(() =>
      expect(screen.getByText(/Szczegóły frekwencji/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Spóźniony/i)).toBeInTheDocument();
    expect(screen.queryByText(/Nauczyciel:/i)).not.toBeInTheDocument();
  });

  test("rodzic oceny details renders subject and teacher", async () => {
    vi.mocked(api.getGradeById).mockResolvedValueOnce({
      data: {
        id: "g-1",
        subjectId: "sub-1",
        teacherId: "t-1",
        gradeValue: "FIVE",
        gradeType: "REGULAR_SEMESTER_1",
        weight: 3,
        countToAverage: true,
        description: "Kartkowka",
        createdAt: "2026-03-01T08:00:00.000Z",
        modifiedAt: "2026-03-01T09:00:00.000Z",
      },
    } as any);
    vi.mocked(api.getSubjectById).mockResolvedValueOnce({
      data: { id: "sub-1", name: "Matematyka" },
    } as any);
    vi.mocked(api.getSchoolMemberById).mockResolvedValueOnce({
      data: { userId: "t-1", firstName: "Piotr", lastName: "Kowalski" },
    } as any);

    render(<RodzicOcenaDetailsPage params={Promise.resolve({ id: "g-1" })} />);

    await waitFor(() =>
      expect(screen.getByText(/Szczegoly oceny/i)).toBeInTheDocument(),
    );
    expect(screen.getByText("Matematyka")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(/Piotr Kowalski/i)).toBeInTheDocument();
    expect(screen.getByText(/Tak/i)).toBeInTheDocument();
  });

  test("uczen oceny details falls back to ids when subject/teacher fetch fails", async () => {
    vi.mocked(api.getGradeById).mockResolvedValueOnce({
      data: {
        id: "g-2",
        subjectId: "sub-404",
        teacherId: "t-404",
        gradeValue: "THREE_PLUS",
        gradeType: "FINAL",
        weight: 2,
        countToAverage: false,
        description: "",
        createdAt: "2026-04-01T08:00:00.000Z",
        modifiedAt: "2026-04-01T09:00:00.000Z",
      },
    } as any);
    vi.mocked(api.getSubjectById).mockRejectedValueOnce(
      new Error("no subject"),
    );
    vi.mocked(api.getSchoolMemberById).mockRejectedValueOnce(
      new Error("no teacher"),
    );

    render(<UczenOcenaDetailsPage params={Promise.resolve({ id: "g-2" })} />);

    await waitFor(() =>
      expect(screen.getByText(/Szczegoly oceny/i)).toBeInTheDocument(),
    );
    expect(screen.getByText("sub-404")).toBeInTheDocument();
    expect(screen.getByText("t-404")).toBeInTheDocument();
    expect(screen.getByText("3+")).toBeInTheDocument();
    expect(screen.getByText(/^Nie$/)).toBeInTheDocument();
  });

  test("uczen oceny details shows error when grade fetch fails", async () => {
    vi.mocked(api.getGradeById).mockRejectedValueOnce(new Error("boom"));

    render(<UczenOcenaDetailsPage params={Promise.resolve({ id: "g-9" })} />);

    await waitFor(() =>
      expect(
        screen.getByText(/Blad podczas pobierania oceny/i),
      ).toBeInTheDocument(),
    );
  });
});
