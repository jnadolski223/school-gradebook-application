import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
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
        return { id: "subject-1" };
      }
      return (actual as any).use(resource);
    },
  };
});

import PrzedmiotyPage from "../app/dashboard/administratorSzkoly/przedmioty/page";
import EdytujPrzedmiotPage from "../app/dashboard/administratorSzkoly/przedmioty/[id]/page";
import DodajPrzedmiotPage from "../app/dashboard/administratorSzkoly/przedmioty/dodaj/page";

describe("School subjects pages", () => {
  beforeEach(() => {
    resetCommonMocks();
  });

  test("przedmioty page renders list and supports navigation", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [
        { id: "s-1", name: "Matematyka" },
        { id: "s-2", name: "Fizyka" },
      ],
    } as any);

    render(<PrzedmiotyPage />);

    await waitFor(() =>
      expect(screen.getByText("Matematyka")).toBeInTheDocument(),
    );
    expect(screen.getByText("Fizyka")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Dodaj nowy przedmiot/i }),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/przedmioty/dodaj",
    );

    fireEvent.click(screen.getAllByRole("button", { name: /Edytuj/i })[0]);
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/przedmioty/s-1",
    );
  });

  test("przedmioty page deletes subject when confirmed", async () => {
    vi.mocked(api.getSubjectsBySchoolId).mockResolvedValueOnce({
      data: [{ id: "s-1", name: "Matematyka" }],
    } as any);
    vi.mocked(api.deleteSubject).mockResolvedValueOnce({} as any);
    global.confirm = vi.fn(() => true);

    render(<PrzedmiotyPage />);

    await waitFor(() =>
      expect(screen.getByText("Matematyka")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() => expect(api.deleteSubject).toHaveBeenCalledWith("s-1"));
    await waitFor(() =>
      expect(screen.queryByText("Matematyka")).not.toBeInTheDocument(),
    );
  });

  test("przedmioty page shows school missing error", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<PrzedmiotyPage />);

    expect(screen.getByText(/Brak informacji o szkole/i)).toBeInTheDocument();
  });

  test("dodaj przedmiot page validates and creates subject", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });
    vi.mocked(api.createSubject).mockResolvedValueOnce({} as any);

    render(<DodajPrzedmiotPage />);

    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/Nazwa przedmiotu jest wymagana/i),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByPlaceholderText("Nazwa przedmiotu"), {
      target: { value: "Chemia" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(api.createSubject).toHaveBeenCalledWith({
        schoolId: "school-1",
        name: "Chemia",
      }),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/przedmioty",
    );
  });

  test("edytuj przedmiot page validates and updates subject", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSubjectById).mockResolvedValueOnce({
      data: { id: "subject-1", name: "Biologia" },
    } as any);
    vi.mocked(api.updateSubject).mockResolvedValueOnce({} as any);

    render(
      <React.Suspense fallback={<div>loading params</div>}>
        <EdytujPrzedmiotPage params={Promise.resolve({ id: "subject-1" })} />
      </React.Suspense>,
    );

    await waitFor(() =>
      expect(screen.getByDisplayValue("Biologia")).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByDisplayValue("Biologia"), {
      target: { value: "Informatyka" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Zapisz$/i }));

    await waitFor(() =>
      expect(api.updateSubject).toHaveBeenCalledWith("subject-1", {
        name: "Informatyka",
      }),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/przedmioty",
    );
  });
});
