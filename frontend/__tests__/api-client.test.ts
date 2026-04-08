import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  createGrade,
  createSchoolMember,
  deleteGrade,
  deleteSchoolApplication,
  getAllSchoolApplications,
  getAllSchoolMembers,
  getAllStudents,
  getAllUsers,
  getAttendanceById,
  getAttendancesByStudentId,
  toggleSchoolActivation,
  updateSchoolApplicationStatus,
} from "@/lib/api";

const mockFetch = vi.fn();

type MockResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

function jsonResponse(data: unknown, status = 200): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

beforeEach(() => {
  mockFetch.mockReset();
  global.fetch = mockFetch as any;
});

describe("api client", () => {
  test("getAllSchoolApplications builds URL with optional status", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: [] }),
    );

    await getAllSchoolApplications("PENDING");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/school-applications?status=PENDING",
    );
  });

  test("updateSchoolApplicationStatus sends PATCH with JSON body", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: { id: "a-1" } }),
    );

    await updateSchoolApplicationStatus("a-1", "APPROVED");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/school-applications/a-1",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      }),
    );
  });

  test("deleteSchoolApplication accepts status 204", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await expect(deleteSchoolApplication("a-2")).resolves.toBeUndefined();
  });

  test("deleteSchoolApplication throws for non-204", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 } as any);

    await expect(deleteSchoolApplication("a-2")).rejects.toThrow(
      "Failed to delete school application",
    );
  });

  test("toggleSchoolActivation calls activate endpoint", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await toggleSchoolActivation("s-1", true);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/schools/s-1/activate",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  test("toggleSchoolActivation throws with deactivate message on error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 } as any);

    await expect(toggleSchoolActivation("s-1", false)).rejects.toThrow(
      "Failed to deactivate school",
    );
  });

  test("getAllUsers appends active query param", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: [] }),
    );

    await getAllUsers(true);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/users?active=true",
    );
  });

  test("getAllStudents appends both optional query params", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: [] }),
    );

    await getAllStudents("class-1", "parent-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/students?schoolClassId=class-1&parentId=parent-1",
    );
  });

  test("createSchoolMember requires 201 status", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse(
        { status: 201, message: "created", data: { userId: "u-1" } },
        201,
      ),
    );

    await createSchoolMember({
      schoolId: "school-1",
      login: "member.login",
      password: "pass123",
      firstName: "Jan",
      lastName: "Nowak",
      role: "PARENT",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/school-members",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  test("getAllSchoolMembers includes both filters in URL", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: [] }),
    );

    await getAllSchoolMembers("school-1", "PARENT");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/school-members?schoolId=school-1&role=PARENT",
    );
  });

  test("createGrade sends POST with expected payload", async () => {
    const payload = {
      studentId: "st-1",
      teacherId: "t-1",
      subjectId: "sub-1",
      gradeValue: "FIVE" as const,
      gradeType: "FINAL" as const,
      weight: 3,
      countToAverage: true,
      description: "Sprawdzian",
    };

    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: { id: "g-1" } }),
    );

    await createGrade(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/grades",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  });

  test("deleteGrade throws when status is not 204", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 } as any);

    await expect(deleteGrade("g-1")).rejects.toThrow("Failed to delete grade");
  });

  test("getAttendancesByStudentId sends studentId query param", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ status: 200, message: "ok", data: [] }),
    );

    await getAttendancesByStudentId("st-77");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/attendances?studentId=st-77",
    );
  });

  test("getAttendanceById throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 } as any);

    await expect(getAttendanceById("a-404")).rejects.toThrow(
      "Failed to fetch attendance",
    );
  });
});
