import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { resetCommonMocks } from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";

import SchoolsAdminPage from "../app/dashboard/administratorAplikacji/szkoly/page";

beforeEach(() => {
  resetCommonMocks();
});

describe("SchoolsAdminPage", () => {
  test("renders list of schools", async () => {
    const mockSchool = {
      id: "1",
      name: "Test School",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isActive: true,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockSchool] }),
    });

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    expect(screen.getByText(/Aktywna/i)).toBeInTheDocument();
  });

  test("shows empty state", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Brak szkół do wyświetlenia/i),
      ).toBeInTheDocument(),
    );
  });

  test("handles fetch error", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server error",
    });

    render(<SchoolsAdminPage />);

    await waitFor(() => expect(screen.getByText(/500/i)).toBeInTheDocument());
  });

  test("delete works (confirm = true)", async () => {
    const mockSchool = {
      id: "1",
      name: "Test School",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isActive: true,
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockSchool] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

    vi.mocked(api.deleteSchool).mockResolvedValue({} as any);

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() => expect(api.deleteSchool).toHaveBeenCalledWith("1"));
  });

  test("delete cancelled (confirm = false)", async () => {
    const mockSchool = {
      id: "1",
      name: "Test School",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isActive: true,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockSchool] }),
    });

    global.confirm = vi.fn(() => false);

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    expect(api.deleteSchool).not.toHaveBeenCalled();
  });

  test("delete error handling", async () => {
    const mockSchool = {
      id: "1",
      name: "Test School",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isActive: true,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockSchool] }),
    });

    vi.mocked(api.deleteSchool).mockRejectedValue(new Error("Delete failed"));

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() =>
      expect(screen.getByText(/Delete failed/i)).toBeInTheDocument(),
    );
  });

  test("navigation buttons work", async () => {
    const mockSchool = {
      id: "1",
      name: "Test School",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isActive: true,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockSchool] }),
    });

    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(screen.getByText("Test School")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Utwórz szkołę/i));
    expect(window.location.href).toContain("/utworz");

    fireEvent.click(screen.getByRole("button", { name: /Wyświetl/i }));
    expect(window.location.href).toContain("/1");
  });

  test("renders inactive status", async () => {
    const mockSchool = {
      id: "1",
      name: "Test School",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isActive: false,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockSchool] }),
    });

    render(<SchoolsAdminPage />);

    await waitFor(() =>
      expect(screen.getByText(/Nieaktywna/i)).toBeInTheDocument(),
    );
  });
});
