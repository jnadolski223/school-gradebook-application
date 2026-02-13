"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { updateUser, getUserById, User } from "@/lib/api";
import { saveUserToStorage, clearUserFromStorage } from "@/lib/auth";

export default function SchoolAdminProfilePage() {
  const router = useRouter();
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLogin, setEditedLogin] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user data from API when user ID is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userFromStorage?.id) {
        setIsLoadingUser(false);
        return;
      }

      setIsLoadingUser(true);
      setError(null);

      try {
        const response = await getUserById(userFromStorage.id);
        setUserData(response.data);
        setEditedLogin(response.data.login);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Błąd podczas pobierania danych użytkownika",
        );
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [userFromStorage?.id]);

  if (authLoading || isLoadingUser) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  if (!userData || !userFromStorage) {
    return <div style={{ padding: "2rem" }}>Brak danych użytkownika</div>;
  }

  const handleSaveChanges = async () => {
    if (!userData || !userFromStorage) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Build update data - only include fields that should be updated
      const updateData: { login?: string; password?: string } = {};

      if (editedLogin && editedLogin !== userData.login) {
        updateData.login = editedLogin;
      }

      if (editedPassword && editedPassword.trim() !== "") {
        updateData.password = editedPassword;
      }

      // Don't send request if nothing changed
      if (Object.keys(updateData).length === 0) {
        setError("Brak zmian do zapisania");
        setIsSaving(false);
        return;
      }

      const response = await updateUser(userFromStorage.id, updateData);

      // Update localStorage with new user data
      const updatedUser = {
        ...userFromStorage,
        login: response.data.login,
      };
      saveUserToStorage(updatedUser);

      // Update local state with fresh data
      setUserData(response.data);

      setSuccess("Dane zostały zaktualizowane pomyślnie!");
      setEditedPassword("");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas aktualizacji danych",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearUserFromStorage();
    router.push("/login");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h2
        style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#1f2937" }}
      >
        Mój Profil
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

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {!isEditing ? (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                }}
              >
                Login
              </label>
              <p
                style={{
                  margin: "0",
                  fontSize: "1rem",
                  color: "#1f2937",
                  fontWeight: "500",
                }}
              >
                {userData.login}
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                }}
              >
                Hasło
              </label>
              <p
                style={{
                  margin: "0",
                  fontSize: "1rem",
                  color: "#1f2937",
                  fontWeight: "500",
                }}
              >
                ••••••••
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#10b981",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.95rem",
                marginRight: "0.5rem",
              }}
            >
              Edytuj dane
            </button>
            <button
              onClick={handleLogout}
              style={{
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
              Wyloguj
            </button>
          </>
        ) : (
          <>
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
                value={editedLogin}
                onChange={(e) => setEditedLogin(e.target.value)}
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
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
                placeholder="Zostawiać puste, aby nie zmieniać"
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

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  backgroundColor: isSaving ? "#6b7280" : "#10b981",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "0.95rem",
                }}
              >
                {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
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
          </>
        )}
      </div>
    </div>
  );
}
