import { UserLoginResponse } from "./api";

// localStorage utilities for authentication
export function saveUserToStorage(user: UserLoginResponse) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromStorage(): UserLoginResponse | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function clearUserFromStorage() {
  localStorage.removeItem("user");
}

// Get redirect path based on user role
export function getRedirectPathByRole(role: string): string {
  switch (role) {
    case "APP_ADMINISTRATOR":
      return "/dashboard/administratorAplikacji";
    case "SCHOOL_ADMINISTRATOR":
      return "/dashboard/administratorSzkoly";
    case "TEACHER":
      return "/dashboard/nauczyciel";
    case "STUDENT":
      return "/dashboard/uczen";
    case "PARENT":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}

// Check if user has required role for a route
export function hasRequiredRole(
  userRole: string | undefined,
  requiredRoles: string[],
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

// Get required roles for each route
export function getRequiredRolesForRoute(path: string): string[] {
  if (path.includes("administratorAplikacji")) {
    return ["APP_ADMINISTRATOR"];
  }
  if (path.includes("administratorSzkoly")) {
    return ["SCHOOL_ADMINISTRATOR"];
  }
  if (path.includes("nauczyciel")) {
    return ["TEACHER"];
  }
  if (path.includes("uczen")) {
    return ["STUDENT"];
  }
  // Dashboard is accessible to anyone authenticated
  return [
    "APP_ADMINISTRATOR",
    "SCHOOL_ADMINISTRATOR",
    "TEACHER",
    "STUDENT",
    "PARENT",
  ];
}
