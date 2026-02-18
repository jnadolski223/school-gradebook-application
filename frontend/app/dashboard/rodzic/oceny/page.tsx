"use client";

import React, { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getAllStudents, StudentResponse } from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function RodzicOcenyPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.id) {
      setError("Brak informacji o rodzicu");
      setLoading(false);
      return;
    }

    // Pobierz listę uczniów przypisanych do rodzica
    const fetchStudents = async () => {
      try {
        const studentsRes = await getAllStudents(undefined, storedUser.id);
        setStudents(studentsRes.data || []);

        // Wczytaj wybranego ucznia z localStorage lub ustaw pierwszego
        const savedStudentId = localStorage.getItem("selectedStudentId");
        if (
          savedStudentId &&
          studentsRes.data?.some((s) => s.schoolMemberId === savedStudentId)
        ) {
          setSelectedStudentId(savedStudentId);
          setSelectedStudent(
            studentsRes.data.find((s) => s.schoolMemberId === savedStudentId) ||
              null,
          );
        } else if (studentsRes.data && studentsRes.data.length > 0) {
          setSelectedStudentId(studentsRes.data[0].schoolMemberId);
          setSelectedStudent(studentsRes.data[0]);
        } else {
          setError("Brak przypisanych uczniów");
        }
      } catch (err) {
        setError("Błąd podczas pobierania uczniów");
      }
    };

    fetchStudents();
    setLoading(false);
  }, []);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    localStorage.setItem("selectedStudentId", studentId);
    const student = students.find((s) => s.schoolMemberId === studentId);
    setSelectedStudent(student || null);
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ładowanie...</p>
      </div>
    );
  }

  if (error && !students.length) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "1rem",
            margin: "0 0 1rem 0",
          }}
        >
          Oceny
        </h2>

        {students.length > 0 && (
          <div style={{ maxWidth: "300px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#374151",
                fontWeight: "500",
                fontSize: "0.95rem",
              }}
            >
              Wybierz ucznia
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleSelectStudent(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            >
              {students.map((student) => (
                <option
                  key={student.schoolMemberId}
                  value={student.schoolMemberId}
                >
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {selectedStudent ? (
          <div style={{ color: "#6b7280", textAlign: "center" }}>
            Oceny dla ucznia: {selectedStudent.firstName}{" "}
            {selectedStudent.lastName}
          </div>
        ) : (
          <div style={{ color: "#ef4444", textAlign: "center" }}>
            Nie wybrano ucznia
          </div>
        )}
      </div>
    </div>
  );
}
