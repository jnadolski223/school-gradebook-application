"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolClassesBySchoolId,
  deleteSchoolClass,
  getUserById,
  SchoolClass,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

interface ClassWithTeacher extends SchoolClass {
  teacherName?: string;
}

export default function AdministratorSzkolyKlasyPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassWithTeacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

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
    fetchClasses(schoolId);
  }, [schoolId]);

  async function fetchClasses(targetSchoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await getSchoolClassesBySchoolId(targetSchoolId);
      const classesData = result.data;

      // Fetch teacher names for each class
      const classesWithTeachers = await Promise.all(
        classesData.map(async (cls) => {
          try {
            const teacherData = await getUserById(cls.homeroomTeacherId);
            const user = teacherData.data;
            return {
              ...cls,
              teacherName: `${user.login}`,
            };
          } catch {
            return {
              ...cls,
              teacherName: "Unknown",
            };
          }
        }),
      );

      setClasses(classesWithTeachers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  const handleAddClass = () => {
    router.push("/dashboard/administratorSzkoly/klasy/dodaj");
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      await deleteSchoolClass(classId);
      setClasses(classes.filter((cls) => cls.id !== classId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete class");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={handleAddClass}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Dodaj nową klasę
      </button>

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#fee2e2",
            color: "#7f1d1d",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {classes.length === 0 ? (
        <p style={{ color: "#6b7280", textAlign: "center", marginTop: "40px" }}>
          No classes found
        </p>
      ) : (
        <div>
          {classes.map((cls) => (
            <div
              key={cls.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
                gap: "20px",
              }}
            >
              {/* Left: Class Name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                  {cls.name}
                </div>
              </div>

              {/* Middle: Teacher Name */}
              <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  {cls.teacherName || "No teacher assigned"}
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
