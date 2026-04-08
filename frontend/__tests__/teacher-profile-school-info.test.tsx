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

import NauczycielProfilPage from "../app/dashboard/nauczyciel/profil/page";
import NauczycielInformacjeOSzkolePage from "../app/dashboard/nauczyciel/informacje-o-szkole/page";

describe("Teacher profile and school info pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    useProtectedRouteMock.mockReturnValue({
      user: { id: "t-1", schoolId: "school-1", login: "teacher" },
      isAuthorized: true,
      isLoading: false,
    });
  });

  test("teacher profile updates login and logs out", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "t-1", login: "teacherOld" },
    } as any);
    vi.mocked(api.updateUser).mockResolvedValueOnce({
      data: { id: "t-1", login: "teacherNew" },
    } as any);

    render(<NauczycielProfilPage />);

    await waitFor(() =>
      expect(screen.getByText("teacherOld")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));
    fireEvent.change(screen.getByDisplayValue("teacherOld"), {
      target: { value: "teacherNew" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("t-1", {
        login: "teacherNew",
      }),
    );
    expect(auth.saveUserToStorage).toHaveBeenCalledWith(
      expect.objectContaining({ login: "teacherNew" }),
    );

    fireEvent.click(screen.getByRole("button", { name: /Wyloguj/i }));
    expect(auth.clearUserFromStorage).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("teacher school info page renders school data", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValueOnce({
      data: {
        id: "school-1",
        name: "SP Nauczyciel",
        rspoNumber: "998877",
        street: "Szkolna 2",
        postalCode: "00-002",
        city: "Krakow",
        phoneNumber: "123123123",
        email: "sp@test.pl",
      },
    } as any);

    render(<NauczycielInformacjeOSzkolePage />);

    await waitFor(() =>
      expect(screen.getByText(/Informacje o szkole/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/SP Nauczyciel/i)).toBeInTheDocument();
    expect(screen.getByText(/998877/i)).toBeInTheDocument();
    expect(screen.getByText(/Szkolna 2, 00-002 Krakow/i)).toBeInTheDocument();
  });

  test("teacher school info shows missing school assignment", async () => {
    useProtectedRouteMock.mockReturnValue({
      user: { id: "t-1" },
      isAuthorized: true,
      isLoading: false,
    });

    render(<NauczycielInformacjeOSzkolePage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak przypisanej szkoły/i)).toBeInTheDocument(),
    );
  });
});
