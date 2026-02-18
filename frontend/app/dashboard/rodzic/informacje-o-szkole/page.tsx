"use client";

import React, { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getAllStudents,
  getSchoolById,
  School,
  StudentResponse,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function RodzicInformacjeOSzkolePage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [schoolData, setSchoolData] = useState<School | null>(null);

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
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Błąd podczas pobierania uczniów");
        setLoading(false);
        return;
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudent?.schoolId) {
      return;
    }

    fetchSchoolData(selectedStudent.schoolId);
  }, [selectedStudent]);

  async function fetchSchoolData(schoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await getSchoolById(schoolId);
      setSchoolData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Błąd podczas pobierania danych szkoły",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    localStorage.setItem("selectedStudentId", studentId);
    const student = students.find((s) => s.schoolMemberId === studentId);
    setSelectedStudent(student || null);
  };

  if (authLoading || loading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  if (error && !students.length) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            color: "#991b1b",
            border: "1px solid #dc2626",
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            borderRadius: "4px",
            borderLeft: "4px solid #dc2626",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h2
        style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1f2937" }}
      >
        Informacje o szkole
      </h2>

      {students.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
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

      {schoolData && (
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
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Nazwa
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.name}
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
              Numer RSPO
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.rspoNumber}
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
              Adres
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.street}, {schoolData.postalCode} {schoolData.city}
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
              Telefon
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.phoneNumber}
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
              Email
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
