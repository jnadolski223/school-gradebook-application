import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

type AuthModuleMocks = {
  getUserFromStorageMock: ReturnType<typeof vi.fn>;
  hasRequiredRoleMock: ReturnType<typeof vi.fn>;
  getRequiredRolesForRouteMock: ReturnType<typeof vi.fn>;
};

async function loadHookWithMocks(
  authEnabledValue: "true" | "false",
  configure?: (mocks: AuthModuleMocks) => void,
) {
  vi.resetModules();
  process.env.NEXT_PUBLIC_ENABLE_AUTH_CHECK = authEnabledValue;

  const pushMock = vi.fn();
  const getUserFromStorageMock = vi.fn();
  const hasRequiredRoleMock = vi.fn();
  const getRequiredRolesForRouteMock = vi.fn(() => ["TEACHER"]);

  configure?.({
    getUserFromStorageMock,
    hasRequiredRoleMock,
    getRequiredRolesForRouteMock,
  });

  vi.doMock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
    usePathname: () => "/dashboard/nauczyciel",
  }));

  vi.doMock("@/lib/auth", () => ({
    getUserFromStorage: getUserFromStorageMock,
    hasRequiredRole: hasRequiredRoleMock,
    getRequiredRolesForRoute: getRequiredRolesForRouteMock,
  }));

  const { useProtectedRoute } = await import("../hooks/useProtectedRoute");

  return {
    useProtectedRoute,
    pushMock,
    getUserFromStorageMock,
    hasRequiredRoleMock,
    getRequiredRolesForRouteMock,
  };
}

describe("useProtectedRoute", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_ENABLE_AUTH_CHECK;
  });

  test("authorizes immediately when auth check is disabled", async () => {
    const { useProtectedRoute, pushMock, getUserFromStorageMock } =
      await loadHookWithMocks("false");

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthorized).toBe(true);
    expect(result.current.user).toBe(null);
    expect(getUserFromStorageMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("redirects to login when auth check is enabled and no user exists", async () => {
    const { useProtectedRoute, pushMock, getUserFromStorageMock } =
      await loadHookWithMocks("true", ({ getUserFromStorageMock: getUser }) => {
        getUser.mockReturnValue(null);
      });

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getUserFromStorageMock).toHaveBeenCalled();
    expect(result.current.isAuthorized).toBe(false);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("sets user and authorization when role matches route", async () => {
    const storedUser = { id: "u-1", role: "TEACHER", schoolId: "s-1" };

    const { useProtectedRoute, hasRequiredRoleMock } = await loadHookWithMocks(
      "true",
      ({ getUserFromStorageMock, hasRequiredRoleMock }) => {
        getUserFromStorageMock.mockReturnValue(storedUser);
        hasRequiredRoleMock.mockReturnValue(true);
      },
    );

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(hasRequiredRoleMock).toHaveBeenCalledWith("TEACHER", ["TEACHER"]);
    expect(result.current.isAuthorized).toBe(true);
    expect(result.current.user).toEqual(storedUser);
  });

  test("redirects to login when user does not have required role", async () => {
    const { useProtectedRoute, pushMock } = await loadHookWithMocks(
      "true",
      ({ getUserFromStorageMock, hasRequiredRoleMock }) => {
        getUserFromStorageMock.mockReturnValue({ id: "u-1", role: "STUDENT" });
        hasRequiredRoleMock.mockReturnValue(false);
      },
    );

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthorized).toBe(false);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("redirects to login when authorization check throws", async () => {
    const { useProtectedRoute, pushMock } = await loadHookWithMocks(
      "true",
      ({ getUserFromStorageMock }) => {
        getUserFromStorageMock.mockImplementation(() => {
          throw new Error("storage error");
        });
      },
    );

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
