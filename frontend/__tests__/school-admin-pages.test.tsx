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

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    use: (resource: unknown) => {
      if (
        resource &&
        typeof resource === "object" &&
        "then" in resource &&
        typeof (resource as Promise<unknown>).then === "function"
      ) {
        return { id: "class-1" };
      }
      return (actual as any).use(resource);
    },
  };
});

import SchoolAdminProfilePage from "../app/dashboard/administratorSzkoly/profil/page";
import DaneSzkolyPage from "../app/dashboard/administratorSzkoly/daneSzkoly/page";
import DodajKlasePage from "../app/dashboard/administratorSzkoly/klasy/dodaj/page";
import EdytujKlasePage from "../app/dashboard/administratorSzkoly/klasy/[id]/page";

describe("School administrator pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    useProtectedRouteMock.mockReturnValue({
      user: { id: "user-1", login: "schoolAdmin" },
      isAuthorized: true,
      isLoading: false,
    });
  });

  test("profile page saves edited login and logs out", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "user-1", login: "oldLogin" },
    } as any);
    vi.mocked(api.updateUser).mockResolvedValueOnce({
      data: { id: "user-1", login: "newLogin" },
    } as any);

    render(<SchoolAdminProfilePage />);

    await waitFor(() =>
      expect(screen.getByText("oldLogin")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));
    fireEvent.change(screen.getByDisplayValue("oldLogin"), {
      target: { value: "newLogin" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("user-1", {
        login: "newLogin",
      }),
    );
    expect(auth.saveUserToStorage).toHaveBeenCalledWith(
      expect.objectContaining({ login: "newLogin" }),
    );

    fireEvent.click(screen.getByRole("button", { name: /Wyloguj/i }));
    expect(auth.clearUserFromStorage).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("dane szkoly page loads and updates school", async () => {
    vi.mocked(api.getSchoolById).mockResolvedValueOnce({
      data: {
        id: "school-1",
        name: "SP 1",
        rspoNumber: "123",
        city: "Warszawa",
        postalCode: "00-001",
        street: "Szkolna 1",
        phoneNumber: "111222333",
        email: "sp1@test.pl",
        isActive: true,
      },
    } as any);

    vi.mocked(api.updateSchool).mockResolvedValueOnce({
      data: {
        id: "school-1",
        name: "SP 1 Updated",
        rspoNumber: "123",
        city: "Warszawa",
        postalCode: "00-001",
        street: "Szkolna 2",
        phoneNumber: "111222333",
        email: "sp1@test.pl",
        isActive: true,
      },
    } as any);

    render(<DaneSzkolyPage />);

    await waitFor(() => expect(screen.getByText(/SP 1/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Edytuj/i }));
    fireEvent.change(screen.getByDisplayValue("SP 1"), {
      target: { value: "SP 1 Updated" },
    });
    fireEvent.change(screen.getByDisplayValue("Szkolna 1"), {
      target: { value: "Szkolna 2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz/i }));

    await waitFor(() =>
      expect(api.updateSchool).toHaveBeenCalledWith(
        "school-1",
        expect.objectContaining({
          name: "SP 1 Updated",
          street: "Szkolna 2",
        }),
      ),
    );
  });

  test("dodaj klase page validates and creates class", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [
        {
          userId: "t-1",
          firstName: "Anna",
          lastName: "Nowak",
        },
      ],
    } as any);

    vi.mocked(api.createSchoolClass).mockResolvedValueOnce({
      data: { id: "class-1" },
    } as any);

    render(<DodajKlasePage />);

    await waitFor(() =>
      expect(screen.getByText(/Dodaj nową klasę/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/Nazwa klasy jest wymagana/i),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByPlaceholderText("Nazwa klasy"), {
      target: { value: "7C" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "t-1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(api.createSchoolClass).toHaveBeenCalledWith({
        schoolId: "school-1",
        homeroomTeacherId: "t-1",
        name: "7C",
      }),
    );
    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("t-1", {
        role: "HOMEROOM_TEACHER",
      }),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/klasy",
    );
  });

  test("edytuj klase page updates class and teacher roles", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSchoolClassById).mockResolvedValueOnce({
      data: {
        id: "class-1",
        schoolId: "school-1",
        name: "7C",
        homeroomTeacherId: "t-old",
      },
    } as any);

    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [
          { userId: "t-old", firstName: "Jan", lastName: "Stary" },
          { userId: "t-new", firstName: "Ewa", lastName: "Nowa" },
        ],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    render(
      <React.Suspense fallback={<div>loading params</div>}>
        <EdytujKlasePage params={Promise.resolve({ id: "class-1" })} />
      </React.Suspense>,
    );

    await waitFor(() =>
      expect(screen.getByDisplayValue("7C")).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByDisplayValue("7C"), {
      target: { value: "8A" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "t-new" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(api.updateSchoolClass).toHaveBeenCalledWith("class-1", {
        name: "8A",
        homeroomTeacherId: "t-new",
      }),
    );
    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("t-old", { role: "TEACHER" }),
    );
    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("t-new", {
        role: "HOMEROOM_TEACHER",
      }),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/klasy",
    );
  });
});
