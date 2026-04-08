import {
  resetCommonMocks,
  useProtectedRouteMock,
  useRouterMock,
} from "./test-utils/common-test-mocks";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import * as api from "@/lib/api";
import * as auth from "@/lib/auth";
import { describe, expect, test } from "vitest";

describe("common-test-mocks", () => {
  test("resetCommonMocks resets globals", () => {
    resetCommonMocks();
    expect(global.fetch).toBeDefined();
    expect(global.confirm).toBeDefined();
  });

  test("next and hook mocks return expected defaults", () => {
    useRouterMock.mockReturnValueOnce({ push: () => undefined });
    useProtectedRouteMock.mockReturnValueOnce({
      isAuthorized: true,
      isLoading: false,
      user: { id: "1" },
    });

    expect(usePathname()).toBe("/dashboard/nauczyciel");
    expect(useParams()).toEqual({ id: "class-1" });
    expect(useRouter()).toBeDefined();
    expect(useProtectedRoute()).toEqual({
      isAuthorized: true,
      isLoading: false,
      user: { id: "1" },
    });
  });

  test("all api and auth mocks are callable", async () => {
    await api.getAllUsers();
    await api.activateUser("u1");
    await api.deactivateUser("u1");
    await api.deleteUser("u1");

    await api.getSchoolClassesBySchoolId("s1");
    await api.getSchoolClassById("c1");
    await api.deleteSchoolClass("c1");
    await api.createSchoolClass({
      schoolId: "s1",
      name: "7C",
      homeroomTeacherId: "t1",
    });
    await api.updateSchoolClass("c1", { name: "8A", homeroomTeacherId: "t2" });

    await api.getAllSchoolMembers("s1", "TEACHER");
    await api.getAllStudents("c1");
    await api.getAttendancesByStudentId("sm1");
    await api.createAttendance({
      teacherId: "t1",
      studentId: "sm1",
      lessonTimeId: "lt1",
      lessonDate: "2026-04-08",
      attendanceStatus: "PRESENT",
    });
    await api.updateAttendance("a1", {
      teacherId: "t1",
      attendanceStatus: "ABSENT",
    });

    await api.getUserById("u1");
    await api.updateUser("u1", { login: "new-login" });
    await api.loginUser({ login: "admin", password: "secret" });

    await api.deleteSchool("s1");
    await api.createSchool({ name: "School" });
    await api.createSchoolAdmin({
      schoolId: "s1",
      login: "a",
      password: "123456",
    });
    await api.getSchoolById("s1");
    await api.updateSchool("s1", { name: "School 2" });
    await api.checkSchoolAdminCreated("s1");
    await api.toggleSchoolActivation("s1", true);

    await api.getSubjectsBySchoolId("s1");
    await api.getSubjectById("sub1");
    await api.createSubject({ schoolId: "s1", name: "Math" });
    await api.updateSubject("sub1", { name: "Math 2" });
    await api.deleteSubject("sub1");

    await api.getLessonTimesBySchoolId("s1");
    await api.createLessonTime({
      schoolId: "s1",
      lessonStart: "08:00",
      lessonEnd: "08:45",
    });
    await api.updateLessonTime("lt1", {
      lessonStart: "08:10",
      lessonEnd: "08:55",
    });
    await api.deleteLessonTime("lt1");

    await api.getAllLessonsBySchoolClassId("c1");
    await api.getAllLessonsByTeacherId("t1");
    await api.createLesson({
      teacherId: "t1",
      schoolClassId: "c1",
      subjectId: "sub1",
      room: "12",
      lessonTimeId: "lt1",
      day: api.DayOfWeek.MONDAY,
    });
    await api.updateLesson("l1", {
      teacherId: "t1",
      schoolClassId: "c1",
      subjectId: "sub1",
      room: "14",
      lessonTimeId: "lt1",
      day: api.DayOfWeek.TUESDAY,
    });
    await api.deleteLesson("l1");

    await api.getAllGrades("sm1");
    await api.createGrade({
      studentId: "sm1",
      teacherId: "t1",
      subjectId: "sub1",
      gradeValue: "FIVE",
      gradeType: "REGULAR_SEMESTER_1",
      weight: 1,
      countToAverage: true,
      description: null,
    });
    await api.updateGrade("g1", {
      studentId: "sm1",
      teacherId: "t1",
      subjectId: "sub1",
      gradeValue: "FOUR",
      gradeType: "FINAL",
      weight: 2,
      countToAverage: true,
      description: "edit",
    });
    await api.deleteGrade("g1");

    await api.getAllSchoolApplications();
    await api.deleteSchoolApplication("app1");
    await api.getSchoolApplicationById("app1");
    await api.updateSchoolApplicationStatus("app1", "APPROVED");

    expect(auth.getUserFromStorage()).toEqual({ schoolId: "school-1" });
    auth.saveUserToStorage({ id: "u1" } as any);
    auth.clearUserFromStorage();
    expect(auth.getRedirectPathByRole("administratorAplikacji" as any)).toBe(
      "/dashboard/administratorAplikacji",
    );

    expect(api.DayOfWeek.SUNDAY).toBe("SUNDAY");
  });
});
