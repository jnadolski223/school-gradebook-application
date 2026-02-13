"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolMemberById,
  getUserById,
  SchoolMember,
  User,
  updateSchoolMember,
  deleteSchoolMember,
  updateUser,
} from "@/lib/api";

type AllowedRole = "STUDENT" | "PARENT" | "TEACHER";
const allowedRoles: AllowedRole[] = ["STUDENT", "PARENT", "TEACHER"];
const isAllowedRole = (role: string): role is AllowedRole =>
  allowedRoles.includes(role as AllowedRole);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MemberDetailsPage({
  params: paramsPromise,
}: PageProps) {
  const { id } = React.use(paramsPromise);
  const router = useRouter();

  const [member, setMember] = useState<SchoolMember | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedLogin, setEditedLogin] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedRole, setEditedRole] = useState<AllowedRole>("STUDENT");

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const memberRes = await getSchoolMemberById(id);
      setMember(memberRes.data);

      const userRes = await getUserById(id);
      setUser(userRes.data);

      setEditedFirstName(memberRes.data.firstName);
      setEditedLastName(memberRes.data.lastName);
      setEditedLogin(userRes.data.login);
      setEditedRole(
        isAllowedRole(userRes.data.role) ? userRes.data.role : "STUDENT",
      );
    } catch (e: any) {
      setError(e?.message ?? "Failed to load member data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveChanges() {
    if (!member || !user) return;

    setIsSaving(true);
    setError(null);

    try {
      // Update school member data
      const memberUpdateData: Partial<SchoolMember> = {};
      if (editedFirstName && editedFirstName !== member.firstName) {
        memberUpdateData.firstName = editedFirstName;
      }
      if (editedLastName && editedLastName !== member.lastName) {
        memberUpdateData.lastName = editedLastName;
      }

      if (Object.keys(memberUpdateData).length > 0) {
        const memberRes = await updateSchoolMember(id, memberUpdateData);
        setMember(memberRes.data);
      }

      // Update user data
      const userUpdateData: {
        login?: string;
        password?: string;
        role?: AllowedRole;
      } = {};
      if (editedLogin && editedLogin !== user.login) {
        userUpdateData.login = editedLogin;
      }
      if (editedPassword && editedPassword.trim() !== "") {
        userUpdateData.password = editedPassword;
      }
      if (editedRole && editedRole !== user.role) {
        userUpdateData.role = editedRole;
      }

      if (Object.keys(userUpdateData).length > 0) {
        const userRes = await updateUser(id, userUpdateData);
        setUser(userRes.data);
      }

      setEditedPassword("");
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć tego członka szkoły? Działanie to nie może być cofnięte.",
      )
    )
      return;

    setError(null);
    try {
      await deleteSchoolMember(id);
      router.push("/dashboard/administratorSzkoly/czlonkowieSzkoly");
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete member");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ color: "#6b7280" }}>Ładowanie...</div>
      </div>
    );
  }

  if (!member || !user) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ color: "#991b1b" }}>Nie znaleziono członka</div>
      </div>
    );
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
        Szczegóły członka
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
            {/* View Mode */}
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

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                }}
              >
                Imię
              </label>
              <p
                style={{
                  margin: "0",
                  fontSize: "1rem",
                  color: "#1f2937",
                  fontWeight: "500",
                }}
              >
                {member.firstName}
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
                Nazwisko
              </label>
              <p
                style={{
                  margin: "0",
                  fontSize: "1rem",
                  color: "#1f2937",
                  fontWeight: "500",
                }}
              >
                {member.lastName}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                }}
              >
                Rola
              </label>
              <p
                style={{
                  margin: "0",
                  fontSize: "1rem",
                  color: "#1f2937",
                  fontWeight: "500",
                }}
              >
                {user.role}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  backgroundColor: "#10b981",
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
              <button
                onClick={handleDelete}
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
                Usuń członka
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
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
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
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
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
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
                Rola
              </label>
              <select
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value as AllowedRole)}
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
                {allowedRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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
