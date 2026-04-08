import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useProtectedRouteMock,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";

import CreateSchoolPage from "../app/dashboard/administratorAplikacji/szkoly/utworz/page";
import CreateSchoolAdminPage from "../app/dashboard/administratorAplikacji/szkoly/[id]/utworz-administratora/page";

const reactUseSpy = vi.spyOn(React, "use");

describe("Create school pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    vi.useRealTimers();
    reactUseSpy.mockReturnValue({ id: "1" } as any);
    useProtectedRouteMock.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
    });
  });

  afterAll(() => {
    reactUseSpy.mockRestore();
  });

  test("CreateSchoolPage validates required fields", async () => {
    render(<CreateSchoolPage />);

    fireEvent.click(screen.getByRole("button", { name: /Utwórz szkołę/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Nazwa szkoły jest wymagana/i),
      ).toBeInTheDocument(),
    );
  });

  test("CreateSchoolPage creates school and redirects", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.createSchool).mockResolvedValueOnce({
      data: { id: "42" },
    } as any);

    render(<CreateSchoolPage />);

    fireEvent.change(screen.getByPlaceholderText("Nazwa szkoły"), {
      target: { value: "Szkoła 42" },
    });
    fireEvent.change(screen.getByPlaceholderText("Numer RSPO"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Miasto"), {
      target: { value: "Gdańsk" },
    });
    fireEvent.change(screen.getByPlaceholderText("Kod pocztowy"), {
      target: { value: "80-001" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ulica"), {
      target: { value: "Morska 1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Utwórz szkołę/i }));

    await waitFor(() => expect(api.createSchool).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        screen.getByText(/Szkoła została utworzona pomyślnie!/i),
      ).toBeInTheDocument(),
    );

    await waitFor(
      () =>
        expect(pushMock).toHaveBeenCalledWith(
          "/dashboard/administratorAplikacji/szkoly/42",
        ),
      { timeout: 3000 },
    );
  });

  test("CreateSchoolAdminPage validates password length", async () => {
    render(<CreateSchoolAdminPage params={Promise.resolve({ id: "1" })} />);

    fireEvent.change(screen.getByPlaceholderText("Login"), {
      target: { value: "admin1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Imię"), {
      target: { value: "Jan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nazwisko"), {
      target: { value: "Kowalski" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Utwórz konto/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Hasło musi mieć co najmniej 6 znaków/i),
      ).toBeInTheDocument(),
    );
  });

  test("CreateSchoolAdminPage creates admin and redirects", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });
    vi.mocked(api.createSchoolAdmin).mockResolvedValueOnce({} as any);

    render(<CreateSchoolAdminPage params={Promise.resolve({ id: "1" })} />);

    fireEvent.change(screen.getByPlaceholderText("Login"), {
      target: { value: "admin1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Imię"), {
      target: { value: "Jan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nazwisko"), {
      target: { value: "Kowalski" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Utwórz konto/i }));

    await waitFor(() => expect(api.createSchoolAdmin).toHaveBeenCalled());
    expect(api.createSchoolAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        schoolId: "1",
        login: "admin1",
        role: "SCHOOL_ADMINISTRATOR",
      }),
    );

    await waitFor(
      () =>
        expect(pushMock).toHaveBeenCalledWith(
          "/dashboard/administratorAplikacji/szkoly/1",
        ),
      { timeout: 3000 },
    );
  });
});
