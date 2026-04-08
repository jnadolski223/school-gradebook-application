import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import {
  resetCommonMocks,
  useProtectedRouteMock,
} from "./test-utils/common-test-mocks";

import RootLayout from "../app/layout";
import HomePage from "../app/page";
import DashboardPage from "../app/dashboard/page";
import AdministratorAplikacjiLayout from "../app/dashboard/administratorAplikacji/layout";
import AdministratorAplikacjiPage from "../app/dashboard/administratorAplikacji/page";
import AdministratorSzkolyLayout from "../app/dashboard/administratorSzkoly/layout";
import AdministratorSzkolyPage from "../app/dashboard/administratorSzkoly/page";
import AdministratorSzkolyKlasyPage from "../app/dashboard/administratorSzkoly/klasy/page";
import NauczycielLayout from "../app/dashboard/nauczyciel/layout";
import NauczycielPage from "../app/dashboard/nauczyciel/page";
import RodzicLayout from "../app/dashboard/rodzic/layout";
import RodzicPage from "../app/dashboard/rodzic/page";
import UczenLayout from "../app/dashboard/uczen/layout";
import UczenPage from "../app/dashboard/uczen/page";

beforeEach(() => {
  resetCommonMocks();
});

describe("App shell and role pages", () => {
  test("Root layout renders children", () => {
    render(
      <RootLayout>
        <div>TEST-ROOT</div>
      </RootLayout>,
    );
    expect(screen.getByText("TEST-ROOT")).toBeInTheDocument();
  });

  test("Home page renders title and action buttons", () => {
    render(<HomePage />);
    expect(screen.getByText(/Dziennik Szkolny/i)).toBeInTheDocument();
    expect(screen.getByText(/Zaloguj/i)).toBeInTheDocument();
    expect(screen.getByText(/Złóż wniosek/i)).toBeInTheDocument();
  });

  test("Dashboard page states and authorized content", () => {
    useProtectedRouteMock.mockReturnValueOnce({
      isAuthorized: false,
      isLoading: true,
    });
    render(<DashboardPage />);
    expect(screen.getByText(/Ładowanie/i)).toBeInTheDocument();

    useProtectedRouteMock.mockReturnValueOnce({
      isAuthorized: false,
      isLoading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByText(/Brak dostępu/i)).toBeInTheDocument();

    useProtectedRouteMock.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByText(/^Dashboard$/i)).toBeInTheDocument();
  });

  test("Administrator aplikacji layout and page works", () => {
    render(
      <AdministratorAplikacjiLayout>
        <div>subcontent</div>
      </AdministratorAplikacjiLayout>,
    );
    expect(screen.getByText("subcontent")).toBeInTheDocument();

    useProtectedRouteMock.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
    });
    render(<AdministratorAplikacjiPage />);
    expect(screen.getByText("subcontent")).toBeInTheDocument();
  });

  test("Administrator szkoły layout and page render", () => {
    render(
      <AdministratorSzkolyLayout>
        <div>Ash content</div>
      </AdministratorSzkolyLayout>,
    );
    expect(screen.getByText("Ash content")).toBeInTheDocument();

    useProtectedRouteMock.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
    });
    render(<AdministratorSzkolyPage />);
    expect(screen.getByText("Ash content")).toBeInTheDocument();
  });

  test("Administrator szkoły klasy page renders and handles empty class state", async () => {
    render(<AdministratorSzkolyKlasyPage />);
    await waitFor(() =>
      expect(screen.getByText(/Dodaj nową klasę/i)).toBeInTheDocument(),
    );
  });

  test("Nauczyciel layout and page render", () => {
    render(
      <NauczycielLayout>
        <div>teacher-content</div>
      </NauczycielLayout>,
    );
    expect(screen.getByText("teacher-content")).toBeInTheDocument();

    render(<NauczycielPage />);
    expect(screen.getByText(/Strona nauczyciela/i)).toBeInTheDocument();
  });

  test("Rodzic layout and page render", () => {
    render(
      <RodzicLayout>
        <div>rodzic-content</div>
      </RodzicLayout>,
    );
    expect(screen.getByText("rodzic-content")).toBeInTheDocument();

    render(<RodzicPage />);
    expect(screen.getByText(/Strona rodzica/i)).toBeInTheDocument();
  });

  test("Uczen layout and page render", () => {
    render(
      <UczenLayout>
        <div>uczen-content</div>
      </UczenLayout>,
    );
    expect(screen.getByText("uczen-content")).toBeInTheDocument();

    render(<UczenPage />);
    expect(screen.getByText(/Strona ucznia/i)).toBeInTheDocument();
  });
});
