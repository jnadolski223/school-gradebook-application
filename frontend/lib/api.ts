const API_BASE_URL = "http://localhost:8080/api/v1";

export interface SchoolApplication {
  id: string;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  schoolName: string;
  schoolStreet: string;
  schoolPostalCode: string;
  schoolCity: string;
  rspoNumber: string;
  description: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface SchoolApplicationShort {
  id: string;
  schoolName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Pobiera wszystkie wnioski
export async function getAllSchoolApplications(
  status?: "PENDING" | "APPROVED" | "REJECTED",
) {
  const url = new URL(`${API_BASE_URL}/school-applications`);
  if (status) {
    url.searchParams.append("status", status);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch school applications");
  }

  return (await response.json()) as ApiResponse<SchoolApplicationShort[]>;
}

// Pobiera wniosek po ID
export async function getSchoolApplicationById(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-applications/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch school application");
  }

  return (await response.json()) as ApiResponse<SchoolApplication>;
}

// Aktualizuje status wniosku
export async function updateSchoolApplicationStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
) {
  const response = await fetch(`${API_BASE_URL}/school-applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update school application status");
  }

  return (await response.json()) as ApiResponse<SchoolApplication>;
}

// Usuwa wniosek
export async function deleteSchoolApplication(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-applications/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete school application");
  }
}

// --- Schools API ---
export interface School {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  rspoNumber: string;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
}

// Pobiera szkołę po ID
export async function getSchoolById(id: string) {
  const response = await fetch(`${API_BASE_URL}/schools/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch school");
  }

  return (await response.json()) as ApiResponse<School>;
}

// Usuwa szkołę
export async function deleteSchool(id: string) {
  const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete school");
  }
}

// Aktywuje/deaktywuje szkołę
export async function toggleSchoolActivation(id: string, activate: boolean) {
  const endpoint = activate ? "activate" : "deactivate";
  const response = await fetch(`${API_BASE_URL}/schools/${id}/${endpoint}`, {
    method: "PATCH",
  });

  if (response.status !== 204) {
    throw new Error(`Failed to ${activate ? "activate" : "deactivate"} school`);
  }
}

// Sprawdza czy konto administratora szkoły zostało utworzone
export async function checkSchoolAdminCreated(schoolId: string) {
  const response = await fetch(
    `${API_BASE_URL}/schools/${schoolId}/is-school-admin-created`,
  );

  if (!response.ok) {
    throw new Error("Failed to check school admin status");
  }

  return (await response.json()) as ApiResponse<boolean>;
}

// Tworzy nową szkołę
export interface CreateSchoolRequest {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  phoneNumber?: string;
  email?: string;
  rspoNumber: string;
}

export async function createSchool(data: CreateSchoolRequest) {
  const response = await fetch(`${API_BASE_URL}/schools`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create school");
  }

  return (await response.json()) as ApiResponse<School>;
}

export interface UpdateSchoolRequest {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  phoneNumber?: string;
  email?: string;
  rspoNumber: string;
}

// Aktualizuje dane szkoły
export async function updateSchool(id: string, data: UpdateSchoolRequest) {
  const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update school");
  }

  return (await response.json()) as ApiResponse<School>;
}

// User types
export type UserRole =
  | "STUDENT"
  | "HOMEROOM_TEACHER"
  | "PARENT"
  | "TEACHER"
  | "SCHOOL_ADMINISTRATOR"
  | "APP_ADMINISTRATOR";

export interface User {
  id: string;
  login: string;
  role: UserRole;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
}

export interface UserRegisterRequest {
  login: string;
  password: string;
  role: UserRole;
}

export interface UserLoginRequest {
  login: string;
  password: string;
}

export interface UserLoginResponse {
  id: string;
  login: string;
  role: UserRole;
  schoolId: string | null;
  isActive: boolean;
}

export interface UserUpdateRequest {
  login?: string;
  password?: string;
  role?: UserRole;
}

// Rejestruje nowego użytkownika
export async function registerUser(data: UserRegisterRequest) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
  }

  return (await response.json()) as ApiResponse<User>;
}

// Loguje użytkownika
export async function loginUser(data: UserLoginRequest) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return (await response.json()) as ApiResponse<UserLoginResponse>;
}

// Pobiera użytkownika po ID
export async function getUserById(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return (await response.json()) as ApiResponse<User>;
}

// Pobiera wszystkich użytkowników
export async function getAllUsers(active?: boolean) {
  const url = new URL(`${API_BASE_URL}/users`);
  if (active !== undefined) {
    url.searchParams.append("active", active.toString());
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return (await response.json()) as ApiResponse<User[]>;
}

// Aktualizuje użytkownika
export async function updateUser(id: string, data: UserUpdateRequest) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return (await response.json()) as ApiResponse<User>;
}

// Aktywuje użytkownika
export async function activateUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}/activate`, {
    method: "PATCH",
  });

  if (response.status !== 204) {
    throw new Error("Failed to activate user");
  }
}

// Deaktywuje użytkownika
export async function deactivateUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}/deactivate`, {
    method: "PATCH",
  });

  if (response.status !== 204) {
    throw new Error("Failed to deactivate user");
  }
}

// Usuwa użytkownika
export async function deleteUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete user");
  }
}

// --- School members API ---
export interface SchoolMember {
  userId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
}

export interface SchoolMemberCreateRequest {
  schoolId: string;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Tworzy nowego członka szkoły
export async function createSchoolMember(data: SchoolMemberCreateRequest) {
  const response = await fetch(`${API_BASE_URL}/school-members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    throw new Error("Failed to create school member");
  }

  return (await response.json()) as ApiResponse<SchoolMember>;
}

// Pobiera wszystkich członków szkół lub filtruje po schoolId i roli
export async function getAllSchoolMembers(schoolId?: string, role?: string) {
  const url = new URL(`${API_BASE_URL}/school-members`);
  if (schoolId) url.searchParams.append("schoolId", schoolId);
  if (role) url.searchParams.append("role", role);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch school members");
  }

  return (await response.json()) as ApiResponse<SchoolMember[]>;
}

// Pobiera członka szkoły po ID
export async function getSchoolMemberById(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-members/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch school member");
  }

  return (await response.json()) as ApiResponse<SchoolMember>;
}

// Aktualizuje członka szkoły
export async function updateSchoolMember(
  id: string,
  data: Partial<SchoolMember>,
) {
  const response = await fetch(`${API_BASE_URL}/school-members/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update school member");
  }

  return (await response.json()) as ApiResponse<SchoolMember>;
}

// Usuwa członka szkoły
export async function deleteSchoolMember(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-members/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete school member");
  }
}

// Tworzy administratora szkoły
export interface CreateSchoolAdminRequest {
  schoolId: string;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "SCHOOL_ADMINISTRATOR";
}

export async function createSchoolAdmin(data: CreateSchoolAdminRequest) {
  const response = await fetch(`${API_BASE_URL}/school-members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create school admin");
  }

  return (await response.json()) as ApiResponse<SchoolMember>;
}

// --- School Classes API ---
export interface SchoolClass {
  id: string;
  schoolId: string;
  homeroomTeacherId: string;
  name: string;
}

export interface CreateSchoolClassRequest {
  schoolId: string;
  homeroomTeacherId: string;
  name: string;
}

export interface UpdateSchoolClassRequest {
  homeroomTeacherId: string;
  name: string;
}

// Tworzy nową klasę szkolną
export async function createSchoolClass(data: CreateSchoolClassRequest) {
  const response = await fetch(`${API_BASE_URL}/school-classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    throw new Error("Failed to create school class");
  }

  return (await response.json()) as ApiResponse<SchoolClass>;
}

// Aktualizuje klasę szkolną
export async function updateSchoolClass(
  id: string,
  data: UpdateSchoolClassRequest,
) {
  const response = await fetch(`${API_BASE_URL}/school-classes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update school class");
  }

  return (await response.json()) as ApiResponse<SchoolClass>;
}

// Pobiera klasy szkolne dla danej szkoły
export async function getSchoolClassesBySchoolId(schoolId: string) {
  const url = new URL(`${API_BASE_URL}/school-classes`);
  url.searchParams.append("schoolId", schoolId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch school classes");
  }

  return (await response.json()) as ApiResponse<SchoolClass[]>;
}

// Pobiera klasę szkolną po ID
export async function getSchoolClassById(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-classes/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch school class");
  }

  return (await response.json()) as ApiResponse<SchoolClass>;
}

// Usuwa klasę szkolną
export async function deleteSchoolClass(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-classes/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete school class");
  }
}

// --- Students API ---
export interface StudentRequest {
  schoolId: string;
  schoolClassId: string | null;
  parentId: string;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface StudentResponse {
  schoolMemberId: string;
  schoolClassId: string | null;
  parentId: string | null;
  schoolId: string;
  login: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface StudentUpdateRequest {
  schoolClassId?: string | null;
  parentId?: string;
}

// Tworzy nowego ucznia
export async function createStudent(data: StudentRequest) {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    throw new Error("Failed to create student");
  }

  return (await response.json()) as ApiResponse<StudentResponse>;
}

// Pobiera ucznia po ID
export async function getStudentById(id: string) {
  const response = await fetch(`${API_BASE_URL}/students/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch student");
  }

  return (await response.json()) as ApiResponse<StudentResponse>;
}

// Pobiera wszystkich uczniów
export async function getAllStudents(
  schoolClassId?: string,
  parentId?: string,
) {
  const url = new URL(`${API_BASE_URL}/students`);
  if (schoolClassId) url.searchParams.append("schoolClassId", schoolClassId);
  if (parentId) url.searchParams.append("parentId", parentId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return (await response.json()) as ApiResponse<StudentResponse[]>;
}

// Aktualizuje ucznia
export async function updateStudent(id: string, data: StudentUpdateRequest) {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update student");
  }

  return (await response.json()) as ApiResponse<StudentResponse>;
}

// Usuwa ucznia
export async function deleteStudent(id: string) {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete student");
  }
}

// --- Subjects API ---
export interface Subject {
  id: string;
  schoolId: string;
  name: string;
}

// Pobiera przedmioty dla danej szkoły
export async function getSubjectsBySchoolId(schoolId: string) {
  const url = new URL(`${API_BASE_URL}/subjects`);
  url.searchParams.append("schoolId", schoolId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return (await response.json()) as ApiResponse<Subject[]>;
}

// Subject request types
export interface CreateSubjectRequest {
  schoolId: string;
  name: string;
}

export interface UpdateSubjectRequest {
  name: string;
}

// Pobiera pojedynczy przedmiot po id
export async function getSubjectById(id: string) {
  const response = await fetch(`${API_BASE_URL}/subjects/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch subject");
  }

  return (await response.json()) as ApiResponse<Subject>;
}

// Tworzy nowy przedmiot
export async function createSubject(data: CreateSubjectRequest) {
  const response = await fetch(`${API_BASE_URL}/subjects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create subject");
  }

  return (await response.json()) as ApiResponse<Subject>;
}

// Aktualizuje przedmiot
export async function updateSubject(id: string, data: UpdateSubjectRequest) {
  const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update subject");
  }

  return (await response.json()) as ApiResponse<Subject>;
}

// Usuwa przedmiot
export async function deleteSubject(id: string) {
  const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete subject");
  }
}

// --- Lesson Times API ---
export interface LessonTimeRequest {
  schoolId: string;
  lessonStart: string;
  lessonEnd: string;
}

export interface LessonTimeResponse {
  id: string;
  schoolId: string;
  lessonStart: string;
  lessonEnd: string;
}

export interface LessonTimeUpdateRequest {
  lessonStart: string;
  lessonEnd: string;
}

// Tworzy nowy rozkład godzin lekcyjnych
export async function createLessonTime(data: LessonTimeRequest) {
  const response = await fetch(`${API_BASE_URL}/lesson-times`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create lesson time");
  }

  return (await response.json()) as ApiResponse<LessonTimeResponse>;
}

// Pobiera rozkład godzin lekcyjnych po ID
export async function getLessonTimeById(id: string) {
  const response = await fetch(`${API_BASE_URL}/lesson-times/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch lesson time");
  }

  return (await response.json()) as ApiResponse<LessonTimeResponse>;
}

// Pobiera wszystkie rozkłady godzin lekcyjnych dla szkoły
export async function getLessonTimesBySchoolId(schoolId: string) {
  const response = await fetch(
    `${API_BASE_URL}/lesson-times?schoolId=${schoolId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lesson times");
  }

  return (await response.json()) as ApiResponse<LessonTimeResponse[]>;
}

// Aktualizuje rozkład godzin lekcyjnych
export async function updateLessonTime(
  id: string,
  data: LessonTimeUpdateRequest,
) {
  const response = await fetch(`${API_BASE_URL}/lesson-times/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update lesson time");
  }

  return (await response.json()) as ApiResponse<LessonTimeResponse>;
}

// Usuwa rozkład godzin lekcyjnych
export async function deleteLessonTime(id: string) {
  const response = await fetch(`${API_BASE_URL}/lesson-times/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete lesson time");
  }
}

// --- Lessons API ---
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export interface LessonRequest {
  teacherId: string;
  schoolClassId: string;
  subjectId: string;
  room: string;
  lessonTimeId: string;
  day: DayOfWeek;
}

export interface LessonResponse {
  id: string;
  teacherId: string;
  schoolClassId: string;
  subjectId: string;
  room: string;
  lessonTimeId: string;
  day: DayOfWeek;
}

// Tworzy nową lekcję
export async function createLesson(data: LessonRequest) {
  const response = await fetch(`${API_BASE_URL}/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create lesson");
  }

  return (await response.json()) as ApiResponse<LessonResponse>;
}

// Pobiera lekcję po ID
export async function getLessonById(id: string) {
  const response = await fetch(`${API_BASE_URL}/lessons/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch lesson");
  }

  return (await response.json()) as ApiResponse<LessonResponse>;
}

// Pobiera wszystkie lekcje
export async function getAllLessons() {
  const response = await fetch(`${API_BASE_URL}/lessons`);

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return (await response.json()) as ApiResponse<LessonResponse[]>;
}

// Pobiera wszystkie lekcje dla klasy
export async function getAllLessonsBySchoolClassId(schoolClassId: string) {
  const response = await fetch(
    `${API_BASE_URL}/lessons?schoolClassId=${schoolClassId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lessons for school class");
  }

  return (await response.json()) as ApiResponse<LessonResponse[]>;
}

// Pobiera wszystkie lekcje dla nauczyciela
export async function getAllLessonsByTeacherId(teacherId: string) {
  const response = await fetch(
    `${API_BASE_URL}/lessons?teacherId=${teacherId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lessons for teacher");
  }

  return (await response.json()) as ApiResponse<LessonResponse[]>;
}

// Aktualizuje lekcję
export async function updateLesson(id: string, data: LessonRequest) {
  const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update lesson");
  }

  return (await response.json()) as ApiResponse<LessonResponse>;
}

// Usuwa lekcję
export async function deleteLesson(id: string) {
  const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete lesson");
  }
}
