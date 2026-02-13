"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSubjectsBySchoolId, deleteSubject, Subject } from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function AdministratorSzkolyPrzedmiotyPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
    fetchSubjects(schoolId);
  }, [schoolId]);

  async function fetchSubjects(targetSchoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await getSubjectsBySchoolId(targetSchoolId);
      setSubjects(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }

  const handleAddSubject = () => {
    router.push("/dashboard/administratorSzkoly/przedmioty/dodaj");
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten przedmiot?")) {
      return;
    }

    try {
      await deleteSubject(subjectId);
      setSubjects(subjects.filter((s) => s.id !== subjectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete subject");
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
        onClick={handleAddSubject}
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
        Dodaj nowy przedmiot
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

      {subjects.length === 0 ? (
        <p style={{ color: "#6b7280", textAlign: "center", marginTop: "40px" }}>
          Brak przedmiotów
        </p>
      ) : (
        <div>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
              }}
            >
              {/* Left: Subject Name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                  {subject.name}
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/administratorSzkoly/przedmioty/${subject.id}`,
                    )
                  }
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
                  onClick={() => handleDeleteSubject(subject.id)}
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
