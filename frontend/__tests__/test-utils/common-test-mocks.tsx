import React from "react";
import { vi } from "vitest";

export const useProtectedRouteMock = vi.fn(() => ({
  isAuthorized: true,
  isLoading: false,
}));

export const useRouterMock = vi.fn(() => ({ push: vi.fn() }));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/hooks/useProtectedRoute", () => ({
  useProtectedRoute: () => useProtectedRouteMock(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/nauczyciel",
  useRouter: () => useRouterMock(),
  useParams: () => ({ id: "class-1" }),
}));

vi.mock("next/font/google", () => ({
  Manrope: () => ({ className: "mock-font" }),
}));

vi.mock("@/lib/api", () => ({
  getAllUsers: vi.fn(async () => ({ data: [] })),
  activateUser: vi.fn(async () => ({})),
  deactivateUser: vi.fn(async () => ({})),
  deleteUser: vi.fn(async () => ({})),
  getSchoolClassesBySchoolId: vi.fn(async () => ({ data: [] })),
  getSchoolClassById: vi.fn(async () => ({ data: null })),
  deleteSchoolClass: vi.fn(async () => ({})),
  createSchoolClass: vi.fn(async () => ({ data: { id: "1" } })),
  updateSchoolClass: vi.fn(async () => ({})),
  getAllSchoolMembers: vi.fn(async () => ({ data: [] })),
  deleteSchoolMember: vi.fn(async () => ({})),
  createSchoolMember: vi.fn(async () => ({ data: { userId: "1" } })),
  getAllStudents: vi.fn(async () => ({ data: [] })),
  createStudent: vi.fn(async () => ({ data: { schoolMemberId: "1" } })),
  getStudentById: vi.fn(async () => ({ data: null })),
  updateStudent: vi.fn(async () => ({ data: null })),
  deleteStudent: vi.fn(async () => ({})),
  getAttendancesByStudentId: vi.fn(async () => ({ data: [] })),
  getAttendanceById: vi.fn(async () => ({ data: null })),
  createAttendance: vi.fn(async () => ({})),
  updateAttendance: vi.fn(async () => ({})),
  getUserById: vi.fn(async () => ({
    data: {
      id: "1",
      login: "defaultUser",
      name: "Test User",
      email: "test@example.com",
    },
  })),
  updateUser: vi.fn(async () => ({ data: { success: true } })),
  loginUser: vi.fn(async () => ({ data: { role: "administratorAplikacji" } })),
  deleteSchool: vi.fn(async () => ({})),
  createSchool: vi.fn(async () => ({ data: { id: "1" } })),
  createSchoolAdmin: vi.fn(async () => ({})),
  getSchoolById: vi.fn(async () => ({ data: null })),
  updateSchool: vi.fn(async () => ({ data: null })),
  checkSchoolAdminCreated: vi.fn(async () => ({ data: false })),
  toggleSchoolActivation: vi.fn(async () => ({})),
  getSubjectsBySchoolId: vi.fn(async () => ({ data: [] })),
  getSubjectById: vi.fn(async () => ({ data: null })),
  getGradeById: vi.fn(async () => ({ data: null })),
  getSchoolMemberById: vi.fn(async () => ({ data: null })),
  updateSchoolMember: vi.fn(async () => ({ data: null })),
  createSubject: vi.fn(async () => ({})),
  updateSubject: vi.fn(async () => ({})),
  deleteSubject: vi.fn(async () => ({})),
  getLessonTimesBySchoolId: vi.fn(async () => ({ data: [] })),
  createLessonTime: vi.fn(async () => ({})),
  updateLessonTime: vi.fn(async () => ({})),
  deleteLessonTime: vi.fn(async () => ({})),
  getAllLessonsBySchoolClassId: vi.fn(async () => ({ data: [] })),
  getAllLessonsByTeacherId: vi.fn(async () => ({ data: [] })),
  createLesson: vi.fn(async () => ({})),
  updateLesson: vi.fn(async () => ({})),
  deleteLesson: vi.fn(async () => ({})),
  getAllGrades: vi.fn(async () => ({ data: [] })),
  createGrade: vi.fn(async () => ({})),
  updateGrade: vi.fn(async () => ({})),
  deleteGrade: vi.fn(async () => ({})),
  DayOfWeek: {
    MONDAY: "MONDAY",
    TUESDAY: "TUESDAY",
    WEDNESDAY: "WEDNESDAY",
    THURSDAY: "THURSDAY",
    FRIDAY: "FRIDAY",
    SATURDAY: "SATURDAY",
    SUNDAY: "SUNDAY",
  },
  getAllSchoolApplications: vi.fn(async () => ({ data: [] })),
  deleteSchoolApplication: vi.fn(async () => ({})),
  getSchoolApplicationById: vi.fn(async () => ({ data: null })),
  updateSchoolApplicationStatus: vi.fn(async () => ({})),
}));

vi.mock("@/lib/auth", () => ({
  getUserFromStorage: vi.fn(() => ({ schoolId: "school-1" })),
  saveUserToStorage: vi.fn(),
  clearUserFromStorage: vi.fn(),
  getRedirectPathByRole: vi.fn(() => "/dashboard/administratorAplikacji"),
}));

export const resetCommonMocks = () => {
  vi.clearAllMocks();
  global.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({ data: [] }),
  })) as any;
  global.confirm = vi.fn(() => true);
};
