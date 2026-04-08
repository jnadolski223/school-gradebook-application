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

import RodzicProfilPage from "../app/dashboard/rodzic/profil/page";
import RodzicInformacjeOSzkolePage from "../app/dashboard/rodzic/informacje-o-szkole/page";
import RodzicOcenyPage from "../app/dashboard/rodzic/oceny/page";
import RodzicFrekwencjaPage from "../app/dashboard/rodzic/frekwencja/page";
import RodzicPlanZajecPage from "../app/dashboard/rodzic/plan-zajec/page";

describe("Rodzic pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    useProtectedRouteMock.mockReturnValue({
      user: { id: "p-1", schoolId: "school-1", login: "parent" },
      isAuthorized: true,
      isLoading: false,
    });
    vi.mocked(auth.getUserFromStorage).mockReturnValue({
      id: "p-1",
      schoolId: "school-1",
      login: "parent",
    } as any);
  });

  test("profil updates login and logs out", async () => {
    const pushMock = vi.fn();
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "p-1", login: "parentOld" },
    } as any);
    vi.mocked(api.updateUser).mockResolvedValueOnce({
      data: { id: "p-1", login: "parentNew" },
    } as any);

    render(<RodzicProfilPage />);

    await waitFor(() =>
      expect(screen.getByText("parentOld")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));
    fireEvent.change(screen.getByDisplayValue("parentOld"), {
      target: { value: "parentNew" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("p-1", {
        login: "parentNew",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: /Wyloguj/i }));
    expect(removeItemSpy).toHaveBeenCalledWith("selectedStudentId");
    expect(auth.clearUserFromStorage).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("informacje-o-szkole displays school data", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValueOnce({
      data: {
        id: "school-1",
        name: "SP Rodzic",
        rspoNumber: "111222",
        street: "Szkolna 1",
        postalCode: "00-001",
        city: "Warszawa",
        phoneNumber: "123123123",
        email: "sp@test.pl",
      },
    } as any);

    render(<RodzicInformacjeOSzkolePage />);

    await waitFor(() =>
      expect(screen.getByText(/Informacje o szkole/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/SP Rodzic/i)).toBeInTheDocument();
    expect(screen.getByText(/111222/i)).toBeInTheDocument();
  });

  test("oceny shows empty state when no grades", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          firstName: "Jan",
          lastName: "Nowak",
          schoolId: "school-1",
        },
      ],
    } as any);
    vi.mocked(api.getAllGrades).mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<RodzicOcenyPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak ocen do wyswietlenia/i),
      ).toBeInTheDocument(),
    );
  });

  test("frekwencja shows empty state when no attendance data", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          firstName: "Jan",
          lastName: "Nowak",
          schoolId: "school-1",
        },
      ],
    } as any);
    vi.mocked(api.getLessonTimesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAttendancesByStudentId).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<RodzicFrekwencjaPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak danych frekwencji do wyświetlenia/i),
      ).toBeInTheDocument(),
    );
  });

  test("plan-zajec renders lesson for selected student", async () => {
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "st-1",
          firstName: "Jan",
          lastName: "Nowak",
          schoolId: "school-1",
          schoolClassId: "c-1",
        },
      ],
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
          room: "12",
          day: "MONDAY",
        },
      ],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Anna", lastName: "Kowalska" }],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    render(<RodzicPlanZajecPage />);

    await waitFor(() =>
      expect(screen.getByText(/Plan Zajęć/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Matematyka/i)).toBeInTheDocument();
    expect(screen.getByText(/Anna Kowalska/i)).toBeInTheDocument();
    expect(screen.getByText(/sala 12/i)).toBeInTheDocument();
  });
});
