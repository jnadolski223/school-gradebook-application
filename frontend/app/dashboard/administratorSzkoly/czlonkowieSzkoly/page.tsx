"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SchoolMember,
  getAllSchoolMembers,
  deleteSchoolMember,
  getUserById,
  getAllStudents,
  deleteStudent,
  deleteUser,
  getSchoolClassesBySchoolId,
  SchoolClass,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

interface MemberWithRole extends SchoolMember {
  role?: string;
  schoolClassId?: string | null;
  isStudent?: boolean;
}

export default function SchoolMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [classList, setClassList] = useState<SchoolClass[]>([]);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      return;
    }
    setSchoolId(storedUser.schoolId);
  }, []);

  useEffect(() => {
    if (!schoolId) return;
    fetchMembers(schoolId);
  }, [schoolId]);

  async function fetchMembers(targetSchoolId: string) {
    setLoading(true);
    setError(null);
    try {
      // Pobierz listę klas
      const classesRes = await getSchoolClassesBySchoolId(targetSchoolId);
      setClassList(classesRes.data || []);

      // Pobierz uczniów
      const studentsRes = await getAllStudents();
      const students = studentsRes.data || [];

      // Pobierz pozostałych członków (PARENT, TEACHER)
      const membersRes = await getAllSchoolMembers(targetSchoolId);
      const membersData = membersRes.data ?? [];

      // Fetch user data for each non-student member to get their role
      const membersWithRole = await Promise.all(
        membersData.map(async (member) => {
          try {
            const userRes = await getUserById(member.userId);
            // Pomiń uczniów (zostali już pobrani przez getAllStudents)
            if (userRes.data.role === "STUDENT") {
              return null;
            }
            return { ...member, role: userRes.data.role, isStudent: false };
          } catch {
            return member;
          }
        }),
      );

      // Filtruj nulls i połącz z uczniami
      const validMembers = membersWithRole.filter(
        (m): m is MemberWithRole => m !== null,
      );

      // Przekształć uczniów do formatu MemberWithRole
      const studentsAsMember: MemberWithRole[] = students.map((student) => ({
        userId: student.schoolMemberId,
        schoolId: student.schoolId,
        firstName: student.firstName,
        lastName: student.lastName,
        role: student.role,
        schoolClassId: student.schoolClassId,
        isStudent: true,
      }));

      setMembers([...validMembers, ...studentsAsMember]);
    } catch (e: any) {
      setError(e?.message ?? "Błąd podczas ładowania członków");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string, isStudent: boolean) {
    if (!confirm("Czy na pewno chcesz usunąć tego członka szkoły?")) return;
    setError(null);
    try {
      if (isStudent) {
        await deleteStudent(userId);
        await deleteSchoolMember(userId);
        await deleteUser(userId);
      } else {
        await deleteSchoolMember(userId);
      }
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

              {/* Middle Right - Class (for students) */}
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                {member.isStudent && member.schoolClassId
                  ? classList.find((c) => c.id === member.schoolClassId)
                      ?.name || "Brak klasy"
                  : member.isStudent
                    ? "Brak klasy"
                    : ""}
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
                  onClick={() =>
                    handleDelete(member.userId, member.isStudent || false)
                  }
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
