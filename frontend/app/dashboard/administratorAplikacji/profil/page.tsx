"use client";

import React, { useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { updateUser } from "@/lib/api";
import { saveUserToStorage } from "@/lib/auth";

export default function Profil() {
  const { user, isLoading } = useProtectedRoute();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLogin, setEditedLogin] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setEditedLogin(user.login);
      // Don't set password from user object as it's typically not returned from backend
      setEditedPassword("");
    }
  }, [user]);

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  if (!user) {
    return <div style={{ padding: "2rem" }}>Brak danych użytkownika</div>;
  }

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Build update data - only include fields that should be updated
      const updateData: { login?: string; password?: string } = {};

      if (editedLogin && editedLogin !== user.login) {
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

      const response = await updateUser(user.id, updateData);

      // Update localStorage with new user data
      const updatedUser = {
        ...user,
        login: response.data.login,
      };
      saveUserToStorage(updatedUser);

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
                {user.login}
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
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              Edytuj dane
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
