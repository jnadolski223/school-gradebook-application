import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import {
  resetCommonMocks,
  useProtectedRouteMock,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";

import SchoolDetailsPage from "../app/dashboard/administratorAplikacji/szkoly/[id]/page";

const reactUseSpy = vi.spyOn(React, "use");

describe("SchoolDetailsPage", () => {
  const mockSchool = {
    id: "1",
    name: "Test School",
    street: "Kwiatowa 1",
    postalCode: "00-001",
    city: "Warszawa",
    phoneNumber: "123456789",
    email: "test@test.pl",
    rspoNumber: "123456",
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isActive: true,
  };

  const renderSchoolDetails = (id = "1") => {
    return render(<SchoolDetailsPage params={Promise.resolve({ id })} />);
  };

  beforeEach(() => {
    resetCommonMocks();
    reactUseSpy.mockReturnValue({ id: "1" } as any);

    useProtectedRouteMock.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      user: { id: "1" },
    });
  });

  afterAll(() => {
    reactUseSpy.mockRestore();
  });

  test("renders loading state", () => {
    useProtectedRouteMock.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      user: { id: "1" },
    });

    renderSchoolDetails("1");

    expect(screen.getByText(/Ładowanie/i)).toBeInTheDocument();
  });

  test("renders school details", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: mockSchool,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: true,
    } as any);

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    expect(screen.getByText(/Warszawa/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
    expect(screen.getByText(/test@test.pl/i)).toBeInTheDocument();
    expect(screen.getByText(/Aktywna/i)).toBeInTheDocument();
  });

  test("handles API error", async () => {
    vi.mocked(api.getSchoolById).mockRejectedValue(new Error("Fetch error"));

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(
        screen.getByText(
          /Nie znaleziono szkoły bądź błąd podczas pobierania danych/i,
        ),
      ).toBeInTheDocument(),
    );
  });

  test("handles school not found", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: null,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: false,
    } as any);

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(screen.getByText(/Nie znaleziono szkoły/i)).toBeInTheDocument(),
    );
  });

  test("toggle activation works", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: mockSchool,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: true,
    } as any);

    vi.mocked(api.toggleSchoolActivation).mockResolvedValue({} as any);

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Dezaktywuj/i }));

    await waitFor(() =>
      expect(api.toggleSchoolActivation).toHaveBeenCalledWith("1", false),
    );

    expect(screen.getByText(/Nieaktywna/i)).toBeInTheDocument();
  });

  test("toggle activation error", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: mockSchool,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: true,
    } as any);

    vi.mocked(api.toggleSchoolActivation).mockRejectedValue(
      new Error("Toggle error"),
    );

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Dezaktywuj/i }));

    await waitFor(() =>
      expect(screen.getByText(/Toggle error/i)).toBeInTheDocument(),
    );
  });

  test("shows create admin button when admin not created", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock });

    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: mockSchool,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: false,
    } as any);

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    const btn = screen.getByRole("button", {
      name: /Utwórz konto administratora szkoły/i,
    });

    fireEvent.click(btn);

    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorAplikacji/szkoly/1/utworz-administratora",
    );
  });

  test("shows admin already created message", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: mockSchool,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: true,
    } as any);

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(
        screen.getByText(/Konto administratora szkoły zostało już utworzone/i),
      ).toBeInTheDocument(),
    );
  });

  test("back button works", async () => {
    const backMock = vi.fn();
    useRouterMock.mockReturnValue({ push: vi.fn(), back: backMock });

    vi.mocked(api.getSchoolById).mockResolvedValue({
      data: mockSchool,
    } as any);

    vi.mocked(api.checkSchoolAdminCreated).mockResolvedValue({
      data: true,
    } as any);

    renderSchoolDetails("1");

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Wróć/i));

    expect(backMock).toHaveBeenCalled();
  });
});
