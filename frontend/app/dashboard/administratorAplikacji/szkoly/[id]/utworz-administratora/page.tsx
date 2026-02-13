"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createSchoolAdmin } from "@/lib/api";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function CreateSchoolAdminPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { isLoading: authLoading } = useProtectedRoute();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (
      !login.trim() ||
      !password.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setIsLoading(true);

    try {
      await createSchoolAdmin({
        schoolId: params.id,
        login: login.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "SCHOOL_ADMINISTRATOR",
      });

      setSuccess("Konto administratora szkoły zostało utworzone pomyślnie!");

      // Redirect back after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/administratorAplikacji/szkoly/${params.id}`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas tworzenia konta",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        ← Wróć
      </button>

      {/* Form card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          maxWidth: "500px",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1f2937",
            marginTop: 0,
            marginBottom: "2rem",
          }}
        >
          Tworzenie konta administratora szkoły
        </h2>

        {/* Error message */}
        {error && (
          <div
            style={{
              color: "#991b1b",
              margin: "0 0 1rem 0",
              border: "1px solid #dc2626",
              padding: "0.75rem",
              backgroundColor: "#fee2e2",
              borderRadius: "4px",
              borderLeft: "4px solid #dc2626",
            }}
          >
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            style={{
              color: "#065f46",
              margin: "0 0 1rem 0",
              border: "1px solid #10b981",
              padding: "0.75rem",
              backgroundColor: "#d1fae5",
              borderRadius: "4px",
              borderLeft: "4px solid #10b981",
            }}
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleCreateAdmin}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Login */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Login
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Login"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* First Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Imię
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Imię"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Nazwisko
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nazwisko"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              opacity: isLoading ? 0.7 : 1,
              marginTop: "0.5rem",
            }}
          >
            {isLoading ? "Tworzenie..." : "Utwórz konto"}
          </button>
        </form>
      </div>
    </div>
  );
}
