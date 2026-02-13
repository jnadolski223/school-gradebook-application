import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getUserFromStorage,
  hasRequiredRole,
  getRequiredRolesForRoute,
} from "@/lib/auth";
import { UserLoginResponse } from "@/lib/api";

const AUTH_CHECK_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AUTH_CHECK === "true";

export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserLoginResponse | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If auth check is disabled, skip protection
    if (!AUTH_CHECK_ENABLED) {
      console.log(
        "Auth check is disabled (NEXT_PUBLIC_ENABLE_AUTH_CHECK=false)",
      );
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Small delay to ensure localStorage is fully available
    const timer = setTimeout(() => {
      const checkAuthorization = () => {
        try {
          // Get user from localStorage
          const storedUser = getUserFromStorage();

          // If no user, redirect to login
          if (!storedUser) {
            console.log("No user found in localStorage, redirecting to /login");
            setIsLoading(false);
            router.push("/login");
            return;
          }

          // Check if user has required role for this route
          const requiredRoles = getRequiredRolesForRoute(pathname);
          const isAllowed = hasRequiredRole(storedUser.role, requiredRoles);

          console.log(
            `User role: ${storedUser.role}, Required: ${requiredRoles.join(", ")}, Allowed: ${isAllowed}`,
          );

          if (!isAllowed) {
            // User doesn't have permission for this route
            console.log(
              "User does not have required role, redirecting to /login",
            );
            setIsLoading(false);
            router.push("/login");
            return;
          }

          // User is authorized
          setUser(storedUser);
          setIsAuthorized(true);
          setIsLoading(false);
        } catch (error) {
          console.error("Error checking authorization:", error);
          setIsLoading(false);
          router.push("/login");
        }
      };

      checkAuthorization();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  return { user, isAuthorized, isLoading };
}
