import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import AdministratorSzkolyKlasyPage from "../app/dashboard/administratorSzkoly/klasy/page";

describe("AdministratorSzkolyKlasyPage", () => {
  beforeEach(() => {
    resetCommonMocks();
    useRouterMock.mockReturnValue({ push: vi.fn(), back: vi.fn() });
  });

  test("shows school missing error when no schoolId", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak informacji o szkole/i)).toBeInTheDocument(),
    );
  });

  test("renders empty state when no classes", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({ data: [] } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText(/No classes found/i)).toBeInTheDocument(),
    );
  });

  test("loads classes with mapped teacher names and fallback Unknown", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [
        { id: "c-1", name: "7C", homeroomTeacherId: "t-1" },
        { id: "c-2", name: "8A", homeroomTeacherId: "missing" },
      ],
    } as any);

    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [
          { userId: "t-1", firstName: "Jan", lastName: "Kowalski" },
          { userId: "t-2", firstName: "Ewa", lastName: "Nowak" },
        ],
      } as any)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Jan", lastName: "Kowalski" }],
      } as any);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() => expect(screen.getByText("7C")).toBeInTheDocument());
    expect(screen.getByText("8A")).toBeInTheDocument();
    expect(screen.getByText(/Wychowawca: Jan Kowalski/i)).toBeInTheDocument();
    expect(screen.getByText(/Wychowawca: Unknown/i)).toBeInTheDocument();
  });

  test("navigates to add, edit and schedule routes", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C", homeroomTeacherId: "t-1" }],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Jan", lastName: "Kowalski" }],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() => expect(screen.getByText("7C")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Dodaj nową klasę/i }));
    fireEvent.click(screen.getByRole("button", { name: /Edytuj/i }));
    fireEvent.click(screen.getByRole("button", { name: /Plan lekcji/i }));

    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/klasy/dodaj",
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/klasy/c-1",
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/klasy/c-1/plan-lekcji",
    );
  });

  test("does not delete class when confirm is false", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C", homeroomTeacherId: "t-1" }],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Jan", lastName: "Kowalski" }],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);

    global.confirm = vi.fn(() => false);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() => expect(screen.getByText("7C")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    expect(api.deleteSchoolClass).not.toHaveBeenCalled();
    expect(screen.getByText("7C")).toBeInTheDocument();
  });

  test("deletes class when confirm is true", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [
        { id: "c-1", name: "7C", homeroomTeacherId: "t-1" },
        { id: "c-2", name: "8A", homeroomTeacherId: "t-1" },
      ],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Jan", lastName: "Kowalski" }],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(api.deleteSchoolClass).mockResolvedValueOnce({} as any);

    global.confirm = vi.fn(() => true);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() => expect(screen.getByText("7C")).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole("button", { name: /Usuń/i })[0]);

    await waitFor(() =>
      expect(api.deleteSchoolClass).toHaveBeenCalledWith("c-1"),
    );
    await waitFor(() =>
      expect(screen.queryByText("7C")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("8A")).toBeInTheDocument();
  });

  test("shows error when delete fails", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "c-1", name: "7C", homeroomTeacherId: "t-1" }],
    } as any);
    vi.mocked(api.getAllSchoolMembers)
      .mockResolvedValueOnce({
        data: [{ userId: "t-1", firstName: "Jan", lastName: "Kowalski" }],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(api.deleteSchoolClass).mockRejectedValueOnce(
      new Error("Delete failed"),
    );
    global.confirm = vi.fn(() => true);

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() => expect(screen.getByText("7C")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() =>
      expect(screen.getByText(/Delete failed/i)).toBeInTheDocument(),
    );
  });

  test("shows error when classes fetch fails", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockRejectedValueOnce(
      new Error("Classes fetch failed"),
    );

    render(<AdministratorSzkolyKlasyPage />);

    await waitFor(() =>
      expect(screen.getByText(/Classes fetch failed/i)).toBeInTheDocument(),
    );
  });
});
