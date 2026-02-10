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

// User types
export type UserRole =
  | "STUDENT"
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
