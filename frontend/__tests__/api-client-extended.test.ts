import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  activateUser,
  checkSchoolAdminCreated,
  createAttendance,
  createLesson,
  createLessonTime,
  createSchool,
  createSchoolAdmin,
  createSchoolClass,
  createStudent,
  createSubject,
  deactivateUser,
  deleteLesson,
  deleteLessonTime,
  deleteSchool,
  deleteSchoolClass,
  deleteSchoolMember,
  deleteStudent,
  deleteSubject,
  deleteUser,
  getAllLessons,
  getAllLessonsBySchoolClassId,
  getAllLessonsByTeacherId,
  getAttendanceById,
  getGradeById,
  getLessonById,
  getLessonTimeById,
  getSchoolApplicationById,
  getSchoolById,
  getSchoolClassById,
  getSchoolClassesBySchoolId,
  getSchoolMemberById,
  getStudentById,
  getSubjectById,
  getSubjectsBySchoolId,
  getUserById,
  loginUser,
  registerUser,
  updateAttendance,
  updateGrade,
  updateLesson,
  updateLessonTime,
  updateSchool,
  updateSchoolClass,
  updateSchoolMember,
  updateStudent,
  updateSubject,
  updateUser,
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

describe("api client extended coverage", () => {
  test("getSchoolApplicationById and getSchoolById success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "app-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "school-1" } }),
      );

    await getSchoolApplicationById("app-1");
    await getSchoolById("school-1");

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8080/api/v1/school-applications/app-1",
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/v1/schools/school-1",
    );
  });

  test("deleteSchool and checkSchoolAdminCreated", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 204 } as any)
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: true }),
      );

    await deleteSchool("school-1");
    const result = await checkSchoolAdminCreated("school-1");

    expect(result.data).toBe(true);
  });

  test("createSchool and updateSchool send payload", async () => {
    const createPayload = {
      name: "SP1",
      street: "Szkolna 1",
      postalCode: "00-001",
      city: "Warszawa",
      rspoNumber: "123",
    };
    const updatePayload = {
      ...createPayload,
      name: "SP1 Updated",
    };

    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "school-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "school-1" } }),
      );

    await createSchool(createPayload);
    await updateSchool("school-1", updatePayload);

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8080/api/v1/schools",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(createPayload),
      }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/v1/schools/school-1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(updatePayload),
      }),
    );
  });

  test("createAttendance and updateAttendance success", async () => {
    const createPayload = {
      teacherId: "t-1",
      studentId: "st-1",
      lessonTimeId: "lt-1",
      lessonDate: "2026-01-01",
      attendanceStatus: "PRESENT" as const,
    };
    const updatePayload = {
      teacherId: "t-2",
      attendanceStatus: "ABSENT" as const,
    };

    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "a-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "a-1" } }),
      );

    await createAttendance(createPayload);
    await updateAttendance("a-1", updatePayload);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/attendances",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/attendances/a-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(updatePayload),
      }),
    );
  });

  test("registerUser and loginUser success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "u-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "u-1" } }),
      );

    await registerUser({ login: "john", password: "pass123", role: "PARENT" });
    await loginUser({ login: "john", password: "pass123" });

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8080/api/v1/users/register",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/v1/users/login",
      expect.objectContaining({ method: "POST" }),
    );
  });

  test("user management endpoints success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "u-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "u-1" } }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any)
      .mockResolvedValueOnce({ ok: true, status: 204 } as any)
      .mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await getUserById("u-1");
    await updateUser("u-1", { login: "john.new" });
    await activateUser("u-1");
    await deactivateUser("u-1");
    await deleteUser("u-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/users/u-1/activate",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  test("school members endpoints success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { userId: "m-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { userId: "m-1" } }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any)
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { userId: "m-2" } }),
      );

    await getSchoolMemberById("m-1");
    await updateSchoolMember("m-1", { firstName: "Anna" });
    await deleteSchoolMember("m-1");
    await createSchoolAdmin({
      schoolId: "school-1",
      login: "admin",
      password: "pass123",
      firstName: "A",
      lastName: "B",
      role: "SCHOOL_ADMINISTRATOR",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/school-members/m-1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  test("school classes endpoints success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 201, message: "ok", data: { id: "c-1" } }, 201),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "c-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: [] }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "c-1" } }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await createSchoolClass({
      schoolId: "school-1",
      homeroomTeacherId: "t-1",
      name: "7A",
    });
    await updateSchoolClass("c-1", { homeroomTeacherId: "t-2", name: "7B" });
    await getSchoolClassesBySchoolId("school-1");
    await getSchoolClassById("c-1");
    await deleteSchoolClass("c-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/school-classes?schoolId=school-1",
    );
  });

  test("students endpoints success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse(
          { status: 201, message: "ok", data: { schoolMemberId: "st-1" } },
          201,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          message: "ok",
          data: { schoolMemberId: "st-1" },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          message: "ok",
          data: { schoolMemberId: "st-1" },
        }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await createStudent({
      schoolId: "school-1",
      schoolClassId: null,
      parentId: "p-1",
      login: "student",
      password: "pass123",
      firstName: "Jan",
      lastName: "Nowak",
    });
    await getStudentById("st-1");
    await updateStudent("st-1", { schoolClassId: "c-1" });
    await deleteStudent("st-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/students/st-1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  test("subjects endpoints success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: [] }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "sub-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "sub-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "sub-1" } }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await getSubjectsBySchoolId("school-1");
    await getSubjectById("sub-1");
    await createSubject({ schoolId: "school-1", name: "Math" });
    await updateSubject("sub-1", { name: "Math 2" });
    await deleteSubject("sub-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/subjects?schoolId=school-1",
    );
  });

  test("lesson times endpoints success", async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "lt-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "lt-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "lt-1" } }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await createLessonTime({
      schoolId: "school-1",
      lessonStart: "08:00:00",
      lessonEnd: "08:45:00",
    });
    await getLessonTimeById("lt-1");
    await updateLessonTime("lt-1", {
      lessonStart: "08:10:00",
      lessonEnd: "08:55:00",
    });
    await deleteLessonTime("lt-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/lesson-times/lt-1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  test("lessons endpoints success", async () => {
    const payload = {
      teacherId: "t-1",
      schoolClassId: "c-1",
      subjectId: "sub-1",
      room: "101",
      lessonTimeId: "lt-1",
      day: "MONDAY" as const,
    };

    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "l-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "l-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: [] }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: [] }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: [] }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "l-1" } }),
      )
      .mockResolvedValueOnce({ ok: true, status: 204 } as any);

    await createLesson(payload);
    await getLessonById("l-1");
    await getAllLessons();
    await getAllLessonsBySchoolClassId("c-1");
    await getAllLessonsByTeacherId("t-1");
    await updateLesson("l-1", payload);
    await deleteLesson("l-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/lessons?schoolClassId=c-1",
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/lessons?teacherId=t-1",
    );
  });

  test("grade and attendance detail endpoints success", async () => {
    const gradePayload = {
      studentId: "st-1",
      teacherId: "t-1",
      subjectId: "sub-1",
      gradeValue: "FOUR" as const,
      gradeType: "FINAL" as const,
      weight: 2,
      countToAverage: true,
      description: "ok",
    };

    mockFetch
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "g-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "g-1" } }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 200, message: "ok", data: { id: "a-1" } }),
      );

    await updateGrade("g-1", gradePayload);
    await getGradeById("g-1");
    await getAttendanceById("a-1");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/grades/g-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  test("example error paths for fetch failures", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 } as any);
    await expect(getUserById("bad")).rejects.toThrow("Failed to fetch user");

    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 } as any);
    await expect(getLessonById("bad")).rejects.toThrow(
      "Failed to fetch lesson",
    );

    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 } as any);
    await expect(getSubjectById("bad")).rejects.toThrow(
      "Failed to fetch subject",
    );
  });
});
