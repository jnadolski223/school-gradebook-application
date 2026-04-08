import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { resetCommonMocks } from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";

import AdministratorAplikacjiKlasyPage from "../app/dashboard/administratorAplikacji/klasy/page";
import UsersAdminPage from "../app/dashboard/administratorAplikacji/uzytkownicy/page";

beforeEach(() => {
  resetCommonMocks();
});

describe("Administrator aplikacji - klasy i użytkownicy", () => {
  test("Administrator aplikacji klasy page renders and allows buttons", async () => {
    render(<AdministratorAplikacjiKlasyPage />);
    expect(
      screen.getByText(/Administrator aplikacji — klasy/i),
    ).toBeInTheDocument();

    const fetchAllBtn = screen.getByRole("button", {
      name: /Fetch all classes/i,
    });
    fireEvent.click(fetchAllBtn);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1" } });
    const fetchByIdButton = screen.getByRole("button", {
      name: /Fetch by schoolId/i,
    });
    fireEvent.click(fetchByIdButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect((global.fetch as any).mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  test("Users admin page states and id lookup error and reset", async () => {
    render(<UsersAdminPage />);
    await waitFor(() =>
      expect(screen.getByText(/Status:/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Pobierz/i }));
    await waitFor(() =>
      expect(screen.getByText(/Podaj id/i)).toBeInTheDocument(),
    );
  });

  test("Users page fetches by id and updates selected user", async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: "u1",
            firstName: "Jan",
            lastName: "Kowalski",
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: "u1",
            firstName: "Adam",
            lastName: "Nowak",
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

    render(<UsersAdminPage />);

    fireEvent.change(screen.getByPlaceholderText("id"), {
      target: { value: "u1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Pobierz/i }));

    await waitFor(() =>
      expect(screen.getByText(/Wybrany użytkownik:/i)).toBeInTheDocument(),
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[1], { target: { value: "Adam" } });
    fireEvent.change(inputs[2], { target: { value: "Nowak" } });
    fireEvent.click(screen.getByRole("button", { name: /Zapisz/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/u1"),
        expect.objectContaining({ method: "PATCH" }),
      ),
    );
  });

  test("Users page action buttons call activate deactivate and delete", async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: "u1",
              email: "u1@test.pl",
              firstName: "Jan",
              lastName: "Kowalski",
              role: "ADMIN",
              isActive: false,
            },
          ],
        }),
      })
      .mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });

    render(<UsersAdminPage />);

    await waitFor(() =>
      expect(screen.getByText(/Jan Kowalski/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /^Aktywuj$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Dezaktywuj$/i }));
    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/u1/activate"),
        expect.objectContaining({ method: "PATCH" }),
      ),
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/u1/deactivate"),
        expect.objectContaining({ method: "PATCH" }),
      ),
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/u1"),
        expect.objectContaining({ method: "DELETE" }),
      ),
    );
  });

  test("shows error when fetchAll fails", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<AdministratorAplikacjiKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText(/Fetch failed/i)).toBeInTheDocument(),
    );
  });

  test("fetchBySchoolId handles API error", async () => {
    render(<AdministratorAplikacjiKlasyPage />);

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "school-1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Fetch by schoolId/i }));

    await waitFor(() =>
      expect(screen.getByText(/Fetch failed/i)).toBeInTheDocument(),
    );
  });

  test("view class details (fetchById) and display them", async () => {
    const mockClass = {
      id: "1",
      schoolId: "school-1",
      homeroomTeacherId: "teacher-1",
      name: "Class A",
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockClass] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockClass }),
      });

    render(<AdministratorAplikacjiKlasyPage />);

    await waitFor(() =>
      expect(
        screen.getByText("Class A", { selector: "strong" }),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    await waitFor(() =>
      expect(screen.getByText(/Details/i)).toBeInTheDocument(),
    );
  });

  test("shows loading detail state when selectedId is set but detail not loaded yet", async () => {
    const mockClass = {
      id: "1",
      schoolId: "school-1",
      homeroomTeacherId: "teacher-1",
      name: "Class A",
    };

    let resolveFetch: any;

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockClass] }),
      })
      .mockImplementationOnce(
        () =>
          new Promise((res) => {
            resolveFetch = res;
          }),
      );

    render(<AdministratorAplikacjiKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText("Class A")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    expect(screen.getByText(/loading detail/i)).toBeInTheDocument();

    resolveFetch({
      ok: true,
      json: async () => ({ data: mockClass }),
    });
  });

  test("update class (PATCH) works and refreshes list", async () => {
    const mockClass = {
      id: "1",
      schoolId: "school-1",
      homeroomTeacherId: "teacher-1",
      name: "Class A",
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockClass] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockClass }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { ...mockClass, name: "Updated Class" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

    render(<AdministratorAplikacjiKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText("Class A")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    await waitFor(() =>
      expect(screen.getByText(/Details/i)).toBeInTheDocument(),
    );

    fireEvent.change(screen.getAllByRole("textbox")[1], {
      target: { value: "Updated Class" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/1"),
        expect.objectContaining({
          method: "PATCH",
        }),
      ),
    );
  });

  test("delete class (confirm = true) works", async () => {
    const mockClass = {
      id: "1",
      schoolId: "school-1",
      homeroomTeacherId: "teacher-1",
      name: "Class A",
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockClass] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockClass }),
      })
      .mockResolvedValueOnce({
        status: 204,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

    global.confirm = vi.fn(() => true);

    render(<AdministratorAplikacjiKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText("Class A")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    await waitFor(() =>
      expect(screen.getByText(/Details/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/1"),
        expect.objectContaining({
          method: "DELETE",
        }),
      ),
    );
  });

  test("delete class is cancelled when confirm = false", async () => {
    const mockClass = {
      id: "1",
      schoolId: "school-1",
      homeroomTeacherId: "teacher-1",
      name: "Class A",
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockClass] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockClass }),
      });

    global.confirm = vi.fn(() => false);

    render(<AdministratorAplikacjiKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText("Class A")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    await waitFor(() =>
      expect(screen.getByText(/Details/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(global.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/1"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
