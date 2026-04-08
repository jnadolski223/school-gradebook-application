import { beforeEach, describe, expect, test } from "vitest";

import {
  clearUserFromStorage,
  getRedirectPathByRole,
  getRequiredRolesForRoute,
  getUserFromStorage,
  hasRequiredRole,
  saveUserToStorage,
} from "@/lib/auth";

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("save/get/clear user in localStorage", () => {
    const user = {
      id: "u-1",
      login: "john",
      role: "PARENT",
      schoolId: "school-1",
      isActive: true,
    } as any;

    saveUserToStorage(user);
    expect(getUserFromStorage()).toEqual(user);

    clearUserFromStorage();
    expect(getUserFromStorage()).toBeNull();
  });

  test("getUserFromStorage returns null for missing key", () => {
    expect(getUserFromStorage()).toBeNull();
  });

  test("getRedirectPathByRole handles all known roles and fallback", () => {
    expect(getRedirectPathByRole("APP_ADMINISTRATOR")).toBe(
      "/dashboard/administratorAplikacji",
    );
    expect(getRedirectPathByRole("SCHOOL_ADMINISTRATOR")).toBe(
      "/dashboard/administratorSzkoly",
    );
    expect(getRedirectPathByRole("TEACHER")).toBe("/dashboard/nauczyciel");
    expect(getRedirectPathByRole("HOMEROOM_TEACHER")).toBe(
      "/dashboard/nauczyciel",
    );
    expect(getRedirectPathByRole("STUDENT")).toBe("/dashboard/uczen");
    expect(getRedirectPathByRole("PARENT")).toBe("/dashboard/rodzic");
    expect(getRedirectPathByRole("UNKNOWN")).toBe("/dashboard");
  });

  test("hasRequiredRole handles undefined and valid role", () => {
    expect(hasRequiredRole(undefined, ["PARENT"])).toBe(false);
    expect(hasRequiredRole("PARENT", ["TEACHER", "PARENT"])).toBe(true);
    expect(hasRequiredRole("STUDENT", ["TEACHER", "PARENT"])).toBe(false);
  });

  test("getRequiredRolesForRoute returns path-specific roles", () => {
    expect(
      getRequiredRolesForRoute("/dashboard/administratorAplikacji/a"),
    ).toEqual(["APP_ADMINISTRATOR"]);
    expect(
      getRequiredRolesForRoute("/dashboard/administratorSzkoly/a"),
    ).toEqual(["SCHOOL_ADMINISTRATOR"]);
    expect(getRequiredRolesForRoute("/dashboard/nauczyciel/a")).toEqual([
      "TEACHER",
      "HOMEROOM_TEACHER",
    ]);
    expect(getRequiredRolesForRoute("/dashboard/rodzic/a")).toEqual(["PARENT"]);
    expect(getRequiredRolesForRoute("/dashboard/uczen/a")).toEqual(["STUDENT"]);
  });

  test("getRequiredRolesForRoute returns dashboard fallback", () => {
    expect(getRequiredRolesForRoute("/dashboard")).toEqual([
      "APP_ADMINISTRATOR",
      "SCHOOL_ADMINISTRATOR",
      "TEACHER",
      "STUDENT",
      "PARENT",
    ]);
  });
});
