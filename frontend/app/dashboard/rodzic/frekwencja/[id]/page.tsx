"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAttendanceById,
  getSubjectById,
  getSchoolMemberById,
  AttendanceResponse,
  AttendanceStatus,
  Subject,
  SchoolMember,
} from "@/lib/api";

const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  PRESENT: "Obecny",
  ABSENT: "Nieobecny",
  EXCUSED: "Zwolniony",
  LATE: "Spóźniony",
  JUSTIFIED: "Usprawiedliwiony",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RodzicFrekwencjaDetailPage({ params }: PageProps) {
  const [attendance, setAttendance] = useState<AttendanceResponse | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [teacher, setTeacher] = useState<SchoolMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = React.use(params);

  useEffect(() => {
    const fetchAttendanceDetails = async () => {
      try {
        setLoading(true);

        // Pobierz szczegóły obecności
        const attendanceRes = await getAttendanceById(id);
        setAttendance(attendanceRes.data);

        // Pobierz informacje o nauczycielu
        if (attendanceRes.data.teacherId) {
          const teacherRes = await getSchoolMemberById(
            attendanceRes.data.teacherId,
          );
          setTeacher(teacherRes.data);
        }

        // TODO: Pobierz informacje o przedmiocie jeśli będzie dostępne w API
        // const subjectRes = await getSubjectById(attendanceRes.data.subjectId);
        // setSubject(subjectRes.data);
      } catch (err) {
        setError("Błąd podczas pobierania szczegółów frekwencji");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ładowanie...</p>
      </div>
    );
  }

  if (error || !attendance) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#ef4444" }}>
          {error || "Nie znaleziono danych frekwencji"}
        </p>
        <Link
          href="/dashboard/rodzic/frekwencja"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            marginTop: "1rem",
            display: "inline-block",
          }}
        >
          ← Powrót do frekwencji
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/dashboard/rodzic/frekwencja"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          ← Powrót do frekwencji
        </Link>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "1.5rem",
          }}
        >
          Szczegóły frekwencji
        </h1>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontWeight: "600", color: "#374151" }}>
              Data lekcji:
            </div>
            <div style={{ color: "#6b7280" }}>
              {new Date(attendance.lessonDate).toLocaleDateString("pl-PL")}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontWeight: "600", color: "#374151" }}>Status:</div>
            <div style={{ color: "#6b7280" }}>
              {attendanceStatusLabels[attendance.attendanceStatus]}
            </div>
          </div>

          {teacher && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
              }}
            >
              <div style={{ fontWeight: "600", color: "#374151" }}>
                Nauczyciel:
              </div>
              <div style={{ color: "#6b7280" }}>
                {teacher.firstName} {teacher.lastName}
              </div>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontWeight: "600", color: "#374151" }}>
              Utworzono:
            </div>
            <div style={{ color: "#6b7280" }}>
              {new Date(attendance.createdAt).toLocaleString("pl-PL")}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontWeight: "600", color: "#374151" }}>
              Ostatnia modyfikacja:
            </div>
            <div style={{ color: "#6b7280" }}>
              {new Date(attendance.modifiedAt).toLocaleString("pl-PL")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
