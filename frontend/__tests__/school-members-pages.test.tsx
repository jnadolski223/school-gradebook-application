import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

import {
  resetCommonMocks,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

import SchoolMembersPage from "../app/dashboard/administratorSzkoly/czlonkowieSzkoly/page";
import MemberDetailsPage from "../app/dashboard/administratorSzkoly/czlonkowieSzkoly/[id]/page";
import AddMemberPage from "../app/dashboard/administratorSzkoly/czlonkowieSzkoly/dodaj/page";

const reactUseSpy = vi.spyOn(React, "use");

afterAll(() => {
  reactUseSpy.mockRestore();
});

describe("School members list page", () => {
  beforeEach(() => {
    resetCommonMocks();
    useRouterMock.mockReturnValue({ push: vi.fn(), back: vi.fn() });
  });

  test("shows school missing error when schoolId is not available", async () => {
    vi.mocked(auth.getUserFromStorage).mockReturnValueOnce(null as any);

    render(<SchoolMembersPage />);

    await waitFor(() =>
      expect(screen.getByText(/Brak informacji o szkole/i)).toBeInTheDocument(),
    );
  });

  test("renders non-students and students with class mapping", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "class-1", name: "7A" }],
    } as any);
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "student-1",
          schoolId: "school-1",
          firstName: "Uczen",
          lastName: "Pierwszy",
          role: "STUDENT",
          schoolClassId: "class-1",
        },
      ],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [
        {
          userId: "teacher-1",
          schoolId: "school-1",
          firstName: "Nauczyciel",
          lastName: "Nowak",
        },
        {
          userId: "student-in-members",
          schoolId: "school-1",
          firstName: "Powinien",
          lastName: "BycPominiety",
        },
      ],
    } as any);
    vi.mocked(api.getUserById)
      .mockResolvedValueOnce({
        data: { id: "teacher-1", role: "TEACHER" },
      } as any)
      .mockResolvedValueOnce({
        data: { id: "student-in-members", role: "STUDENT" },
      } as any);

    render(<SchoolMembersPage />);

    await waitFor(() =>
      expect(screen.getByText(/Nauczyciel Nowak/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Uczen Pierwszy/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Powinien BycPominiety/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText("TEACHER")).toBeInTheDocument();
    expect(screen.getByText("7A")).toBeInTheDocument();
  });

  test("navigates to add page and member details", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "student-1",
          schoolId: "school-1",
          firstName: "Uczen",
          lastName: "Pierwszy",
          role: "STUDENT",
          schoolClassId: null,
        },
      ],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<SchoolMembersPage />);

    await waitFor(() =>
      expect(screen.getByText(/Uczen Pierwszy/i)).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Dodaj nowego członka/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Wyświetl/i }));

    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/czlonkowieSzkoly/dodaj",
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/czlonkowieSzkoly/student-1",
    );
  });

  test("deletes student record when confirmed", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAllStudents).mockResolvedValueOnce({
      data: [
        {
          schoolMemberId: "student-1",
          schoolId: "school-1",
          firstName: "Uczen",
          lastName: "Pierwszy",
          role: "STUDENT",
          schoolClassId: null,
        },
      ],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<SchoolMembersPage />);

    await waitFor(() =>
      expect(screen.getByText(/Uczen Pierwszy/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Usuń/i }));

    await waitFor(() =>
      expect(api.deleteStudent).toHaveBeenCalledWith("student-1"),
    );
    expect(api.deleteSchoolMember).toHaveBeenCalledWith("student-1");
    expect(api.deleteUser).toHaveBeenCalledWith("student-1");
    await waitFor(() =>
      expect(screen.queryByText(/Uczen Pierwszy/i)).not.toBeInTheDocument(),
    );
  });
});

describe("School member details page", () => {
  beforeEach(() => {
    resetCommonMocks();
    reactUseSpy.mockReturnValue({ id: "member-1" } as any);
    useRouterMock.mockReturnValue({ push: vi.fn(), back: vi.fn() });
    vi.mocked(api.getUserById).mockReset();
    vi.mocked(api.getSchoolMemberById).mockReset();
    vi.mocked(api.getStudentById).mockReset();
    vi.mocked(api.getSchoolClassesBySchoolId).mockReset();
    vi.mocked(api.getAllSchoolMembers).mockReset();
    vi.mocked(api.updateSchoolMember).mockReset();
    vi.mocked(api.updateUser).mockReset();
    vi.mocked(api.updateStudent).mockReset();
  });

  test("loads parent member and saves edited data", async () => {
    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "member-1", login: "parent.login", role: "PARENT" },
    } as any);
    vi.mocked(api.getSchoolMemberById).mockResolvedValueOnce({
      data: {
        userId: "member-1",
        schoolId: "school-1",
        firstName: "Anna",
        lastName: "Nowak",
      },
    } as any);
    vi.mocked(api.updateSchoolMember).mockResolvedValueOnce({
      data: {
        userId: "member-1",
        schoolId: "school-1",
        firstName: "Alicja",
        lastName: "Nowak",
      },
    } as any);
    vi.mocked(api.updateUser).mockResolvedValueOnce({
      data: { id: "member-1", login: "new.parent.login", role: "PARENT" },
    } as any);

    render(
      <React.Suspense fallback={<div>loading params</div>}>
        <MemberDetailsPage params={Promise.resolve({ id: "member-1" })} />
      </React.Suspense>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Szczegóły członka/i)).toBeInTheDocument(),
    );
    expect(screen.getByText("parent.login")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));
    fireEvent.change(screen.getByDisplayValue("parent.login"), {
      target: { value: "new.parent.login" },
    });
    fireEvent.change(screen.getByDisplayValue("Anna"), {
      target: { value: "Alicja" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(api.updateSchoolMember).toHaveBeenCalledWith("member-1", {
        firstName: "Alicja",
      }),
    );
    await waitFor(() =>
      expect(api.updateUser).toHaveBeenCalledWith("member-1", {
        login: "new.parent.login",
      }),
    );
  });

  test("validates student parent requirement during save", async () => {
    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "member-1", login: "student.login", role: "STUDENT" },
    } as any);
    vi.mocked(api.getStudentById).mockResolvedValueOnce({
      data: {
        schoolMemberId: "member-1",
        schoolId: "school-1",
        firstName: "Uczen",
        lastName: "Nowy",
        login: "student.login",
        schoolClassId: "class-1",
        parentId: "parent-1",
      },
    } as any);
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "class-1", name: "7A" }],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [{ userId: "parent-1", firstName: "Anna", lastName: "Nowak" }],
    } as any);

    render(
      <React.Suspense fallback={<div>loading params</div>}>
        <MemberDetailsPage params={Promise.resolve({ id: "member-1" })} />
      </React.Suspense>,
    );

    await waitFor(() =>
      expect(screen.getByText(/student.login/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Edytuj dane/i }));

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /Zapisz zmiany/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Rodzic jest obowiązkowy dla ucznia/i),
      ).toBeInTheDocument(),
    );
    expect(api.updateStudent).not.toHaveBeenCalled();
  });

  test("deletes member and navigates to members list", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getUserById).mockResolvedValueOnce({
      data: { id: "member-1", login: "parent.login", role: "PARENT" },
    } as any);
    vi.mocked(api.getSchoolMemberById).mockResolvedValueOnce({
      data: {
        userId: "member-1",
        schoolId: "school-1",
        firstName: "Anna",
        lastName: "Nowak",
      },
    } as any);

    render(
      <React.Suspense fallback={<div>loading params</div>}>
        <MemberDetailsPage params={Promise.resolve({ id: "member-1" })} />
      </React.Suspense>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Szczegóły członka/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Usuń członka/i }));

    await waitFor(() =>
      expect(api.deleteSchoolMember).toHaveBeenCalledWith("member-1"),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/czlonkowieSzkoly",
    );
  });
});

describe("Add member page", () => {
  beforeEach(() => {
    resetCommonMocks();
    useRouterMock.mockReturnValue({ push: vi.fn(), back: vi.fn() });
    vi.mocked(api.getSchoolClassesBySchoolId).mockReset();
    vi.mocked(api.getAllSchoolMembers).mockReset();
    vi.mocked(api.createStudent).mockReset();
    vi.mocked(api.createSchoolMember).mockReset();
  });

  test("validates required fields", async () => {
    render(<AddMemberPage />);

    fireEvent.click(screen.getByRole("button", { name: /Dodaj członka/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Wszystkie pola są wymagane/i),
      ).toBeInTheDocument(),
    );
  });

  test("validates required parent for student", async () => {
    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [],
    } as any);

    render(<AddMemberPage />);

    const textInputs = screen.getAllByRole("textbox");
    const passwordInput = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;

    fireEvent.change(textInputs[0], {
      target: { value: "student.login" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(textInputs[1], {
      target: { value: "Uczen" },
    });
    fireEvent.change(textInputs[2], {
      target: { value: "Nowy" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Dodaj członka/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Dla ucznia rodzic jest obowiązkowy/i),
      ).toBeInTheDocument(),
    );
    expect(api.createStudent).not.toHaveBeenCalled();
  });

  test("creates student and redirects to details page", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [{ id: "class-1", name: "7A" }],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [{ userId: "parent-1", firstName: "Anna", lastName: "Nowak" }],
    } as any);
    vi.mocked(api.createStudent).mockResolvedValueOnce({
      data: { schoolMemberId: "student-1" },
    } as any);

    render(<AddMemberPage />);

    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: /Anna Nowak/i }),
      ).toBeInTheDocument(),
    );

    const textInputs = screen.getAllByRole("textbox");
    const passwordInput = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;

    fireEvent.change(textInputs[0], {
      target: { value: "student.login" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(textInputs[1], {
      target: { value: "Uczen" },
    });
    fireEvent.change(textInputs[2], {
      target: { value: "Nowy" },
    });

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "class-1" } });
    fireEvent.change(selects[2], { target: { value: "parent-1" } });

    fireEvent.click(screen.getByRole("button", { name: /Dodaj członka/i }));

    await waitFor(() =>
      expect(api.createStudent).toHaveBeenCalledWith(
        expect.objectContaining({
          schoolId: "school-1",
          schoolClassId: "class-1",
          parentId: "parent-1",
          login: "student.login",
        }),
      ),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/czlonkowieSzkoly/student-1",
    );
  });

  test("creates parent member and redirects", async () => {
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({ push: pushMock, back: vi.fn() });

    vi.mocked(api.getSchoolClassesBySchoolId).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.getAllSchoolMembers).mockResolvedValueOnce({
      data: [],
    } as any);
    vi.mocked(api.createSchoolMember).mockResolvedValueOnce({
      data: { userId: "parent-1" },
    } as any);

    render(<AddMemberPage />);

    const textInputs = screen.getAllByRole("textbox");
    const passwordInput = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;

    fireEvent.change(textInputs[0], {
      target: { value: "parent.login" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(textInputs[1], {
      target: { value: "Rodzic" },
    });
    fireEvent.change(textInputs[2], {
      target: { value: "Nowak" },
    });

    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "PARENT" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Dodaj członka/i }));

    await waitFor(() =>
      expect(api.createSchoolMember).toHaveBeenCalledWith(
        expect.objectContaining({
          schoolId: "school-1",
          login: "parent.login",
          role: "PARENT",
        }),
      ),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/dashboard/administratorSzkoly/czlonkowieSzkoly/parent-1",
    );
  });
});
