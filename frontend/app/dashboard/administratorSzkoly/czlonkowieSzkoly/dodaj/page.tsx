"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSchoolMember, registerUser } from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

type AllowedRole = "STUDENT" | "PARENT" | "TEACHER";
const allowedRoles: AllowedRole[] = ["STUDENT", "PARENT", "TEACHER"];

export default function AddMemberPage() {
  const router = useRouter();
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AllowedRole>("STUDENT");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      return;
    }
    setSchoolId(storedUser.schoolId);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!schoolId) {
      setError("Brak informacji o szkole");
      return;
    }

    if (
      !login.trim() ||
      !password.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    setIsLoading(true);

    try {
      const userRes = await registerUser({
        login,
        password,
        role,
      });

      const newUserId = userRes.data.id;

      await createSchoolMember({
        userId: newUserId,
        schoolId,
        firstName,
        lastName,
      });

      router.push(
        `/dashboard/administratorSzkoly/czlonkowieSzkoly/${newUserId}`,
      );
    } catch (e: any) {
      setError(e?.message ?? "Błąd podczas dodawania członka");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <button
        onClick={() => router.back()}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: "600",
          marginBottom: "1rem",
        }}
      >
        ← Wróć
      </button>

      <h2
        style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#1f2937" }}
      >
        Dodaj nowego członka
      </h2>

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

      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#374151",
                fontWeight: "500",
              }}
            >
              Login
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.625rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#374151",
                fontWeight: "500",
              }}
            >
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.625rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#374151",
                fontWeight: "500",
              }}
            >
              Imię
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.625rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#374151",
                fontWeight: "500",
              }}
            >
              Nazwisko
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.625rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#374151",
                fontWeight: "500",
              }}
            >
              Rola
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AllowedRole)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.625rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                backgroundColor: "white",
              }}
            >
              {allowedRoles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                backgroundColor: isLoading ? "#6b7280" : "#10b981",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
              }}
            >
              {isLoading ? "Dodawanie..." : "Dodaj członka"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                backgroundColor: "#ef4444",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              Anuluj
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
