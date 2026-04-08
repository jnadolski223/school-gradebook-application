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

import LoginPage from "../app/login/page";
import ProfilPage from "../app/dashboard/administratorAplikacji/profil/page";
import WniosekPage from "../app/wniosek/page";

beforeEach(() => {
  resetCommonMocks();
});

describe("Auth, profile and application form", () => {
  test("Wniosek page handles validation and success state", async () => {
    render(<WniosekPage />);

    fireEvent.click(screen.getByRole("button", { name: /Zatwierdź/i }));
    await waitFor(() =>
      expect(screen.getByText(/Podaj Imię/i)).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByPlaceholderText("Imię"), {
      target: { value: "Jan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nazwisko"), {
      target: { value: "Kowalski" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jan@kowalski.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nazwa szkoły"), {
      target: { value: "Szkoła Testowa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ulica"), {
      target: { value: "Krakowska 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Kod pocztowy"), {
      target: { value: "00-001" },
    });
    fireEvent.change(screen.getByPlaceholderText("Miasto"), {
      target: { value: "Warszawa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Numer RSPO"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Opis"), {
      target: { value: "Testowy opis" },
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: "1",
          senderFirstName: "Jan",
          senderLastName: "Kowalski",
          senderEmail: "jan@kowalski.com",
          schoolName: "Szkoła Testowa",
          schoolStreet: "Krakowska 1",
          schoolPostalCode: "00-001",
          schoolCity: "Warszawa",
          rspoNumber: "123456",
          description: "Testowy opis",
          createdAt: new Date().toISOString(),
          status: "pending",
        },
      }),
    });

    fireEvent.click(screen.getByRole("button", { name: /Zatwierdź/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/Wniosek został pomyślnie utworzony!/i),
      ).toBeInTheDocument(),
    );
  });

  test("Login page handles successful login and data save", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValueOnce({ push: pushMock });

    vi.mocked(auth.getUserFromStorage).mockReturnValue(null);
    vi.mocked(api.loginUser).mockResolvedValue({
      data: { role: "administratorAplikacji" },
    });
    vi.mocked(auth.getRedirectPathByRole).mockReturnValue(
      "/dashboard/administratorAplikacji",
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Login"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Zaloguj/i }));

    await waitFor(() =>
      expect(screen.getByText(/Zalogowano pomyślnie!/i)).toBeInTheDocument(),
    );

    expect(auth.saveUserToStorage).toHaveBeenCalledWith({
      role: "administratorAplikacji",
    });
  });

  test("Profil page fetches user data and updates it", async () => {
    useProtectedRouteMock.mockReturnValue({
      user: { id: "1" },
      isLoading: false,
    });

    vi.mocked(api.getUserById).mockResolvedValue({
      data: { id: "1", login: "userXYZ" },
    });
    vi.mocked(api.updateUser).mockResolvedValue({
      data: { id: "1", login: "userNew" },
    });

    render(<ProfilPage />);

    await waitFor(() =>
      expect(screen.getByText(/userXYZ/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));
    fireEvent.change(screen.getByDisplayValue("userXYZ"), {
      target: { value: "userNew" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Dane zostały zaktualizowane pomyślnie!/i),
      ).toBeInTheDocument(),
    );

    expect(auth.saveUserToStorage).toHaveBeenCalledWith(
      expect.objectContaining({ login: "userNew" }),
    );

    fireEvent.click(screen.getByRole("button", { name: /Wyloguj/i }));
    expect(auth.clearUserFromStorage).toHaveBeenCalled();
  });
});
