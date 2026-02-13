"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SchoolMember,
  getAllSchoolMembers,
  deleteSchoolMember,
  getUserById,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

interface MemberWithRole extends SchoolMember {
  role?: string;
}

export default function SchoolMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolID) {
      setError("Brak informacji o szkole");
      return;
    }
    setSchoolId(storedUser.schoolID);
  }, []);

  useEffect(() => {
    if (!schoolId) return;
    fetchMembers(schoolId);
  }, [schoolId]);

  async function fetchMembers(targetSchoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllSchoolMembers(targetSchoolId);
      const membersData = res.data ?? [];

      // Fetch user data for each member to get their role
      const membersWithRole = await Promise.all(
        membersData.map(async (member) => {
          try {
            const userRes = await getUserById(member.userId);
            return { ...member, role: userRes.data.role };
          } catch {
            return member;
          }
        }),
      );

      setMembers(membersWithRole);
    } catch (e: any) {
      setError(e?.message ?? "Błąd podczas ładowania członków");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Czy na pewno chcesz usunąć tego członka szkoły?")) return;
    setError(null);
    try {
      await deleteSchoolMember(userId);
      setMembers((m) => m.filter((it) => it.userId !== userId));
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() =>
            router.push("/dashboard/administratorSzkoly/czlonkowieSzkoly/dodaj")
          }
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Dodaj nowego członka
        </button>
      </div>

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

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Ładowanie...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {members.map((member) => (
            <div
              key={member.userId}
              style={{
                backgroundColor: "white",
                borderRadius: "6px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left - Name */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  {member.firstName} {member.lastName}
                </h3>
              </div>

              {/* Middle - Role */}
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                {member.role || "Brak roli"}
              </div>

              {/* Right - Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginLeft: "1rem",
                }}
              >
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/administratorSzkoly/czlonkowieSzkoly/${member.userId}`,
                    )
                  }
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Wyświetl
                </button>
                <button
                  onClick={() => handleDelete(member.userId)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}

          {members.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#6b7280",
                backgroundColor: "white",
                borderRadius: "6px",
              }}
            >
              Brak członków do wyświetlenia
            </div>
          )}
        </div>
      )}
    </div>
  );
}
