import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";

import ApplicationsPage from "../app/dashboard/administratorAplikacji/wnioski/page";
import ApplicationDetailsPage from "../app/dashboard/administratorAplikacji/wnioski/[id]/page";

const reactUseSpy = vi.spyOn(React, "use");

describe("Applications pages", () => {
  beforeEach(() => {
    resetCommonMocks();
    vi.useRealTimers();
    reactUseSpy.mockReturnValue({ id: "1" } as any);
  });

  afterAll(() => {
    reactUseSpy.mockRestore();
  });

  test("ApplicationsPage renders list and status label", async () => {
    vi.mocked(api.getAllSchoolApplications).mockResolvedValueOnce({
      data: [
        {
          id: "a1",
          schoolName: "Szkoła Test",
          status: "PENDING",
          createdAt: new Date().toISOString(),
        },
      ],
    } as any);

    render(<ApplicationsPage />);

    await waitFor(() =>
      expect(screen.getByText("Szkoła Test")).toBeInTheDocument(),
    );
    expect(screen.getByText(/Oczekujące/i)).toBeInTheDocument();
  });

  test("ApplicationsPage deletes application when confirmed", async () => {
    vi.mocked(api.getAllSchoolApplications)
      .mockResolvedValueOnce({
        data: [
          {
            id: "a1",
            schoolName: "Szkoła Test",
            status: "PENDING",
            createdAt: new Date().toISOString(),
          },
        ],
      } as any)
      .mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(api.deleteSchoolApplication).mockResolvedValueOnce({} as any);
    global.confirm = vi.fn(() => true);

    render(<ApplicationsPage />);

    await waitFor(() =>
      expect(screen.getByText("Szkoła Test")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() =>
      expect(api.deleteSchoolApplication).toHaveBeenCalledWith("a1"),
    );
  });

  test("ApplicationsPage navigates to details", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getAllSchoolApplications).mockResolvedValueOnce({
      data: [
        {
          id: "a1",
          schoolName: "Szkoła Test",
          status: "PENDING",
          createdAt: new Date().toISOString(),
        },
      ],
    } as any);

    render(<ApplicationsPage />);

    await waitFor(() =>
      expect(screen.getByText("Szkoła Test")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Wyświetl/i }));

    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorAplikacji/wnioski/a1",
    );
  });

  test("ApplicationDetailsPage shows details", async () => {
    vi.mocked(api.getSchoolApplicationById).mockResolvedValueOnce({
      data: {
        id: "1",
        senderFirstName: "Jan",
        senderLastName: "Kowalski",
        senderEmail: "jan@test.pl",
        schoolName: "Szkoła Test",
        schoolCity: "Warszawa",
        schoolPostalCode: "00-001",
        schoolStreet: "Morska 1",
        rspoNumber: "123456",
        description: "Opis wniosku",
        createdAt: new Date().toISOString(),
      },
    } as any);

    render(<ApplicationDetailsPage params={Promise.resolve({ id: "1" })} />);

    await waitFor(() =>
      expect(screen.getByText(/Szczegóły wniosku/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Jan Kowalski/i)).toBeInTheDocument();
    expect(screen.getByText(/Opis wniosku/i)).toBeInTheDocument();
  });

  test("ApplicationDetailsPage handles approve decision and redirect", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSchoolApplicationById).mockResolvedValueOnce({
      data: {
        id: "1",
        senderFirstName: "Jan",
        senderLastName: "Kowalski",
        senderEmail: "jan@test.pl",
        schoolName: "Szkoła Test",
        schoolCity: "Warszawa",
        schoolPostalCode: "00-001",
        schoolStreet: "Morska 1",
        rspoNumber: "123456",
        description: "Opis wniosku",
        createdAt: new Date().toISOString(),
      },
    } as any);
    vi.mocked(api.updateSchoolApplicationStatus).mockResolvedValueOnce(
      {} as any,
    );

    render(<ApplicationDetailsPage params={Promise.resolve({ id: "1" })} />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Zaakceptuj/i }),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Zaakceptuj/i }));

    await waitFor(() =>
      expect(api.updateSchoolApplicationStatus).toHaveBeenCalledWith(
        "1",
        "APPROVED",
      ),
    );

    await waitFor(
      () =>
        expect(pushMock).toHaveBeenCalledWith(
          "/dashboard/administratorAplikacji/wnioski",
        ),
      { timeout: 3000 },
    );
  });
});
