"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getLessonTimesBySchoolId,
  getAttendancesByStudentId,
  AttendanceResponse,
  LessonTimeResponse,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

const attendanceStatusLabels: Record<string, string> = {
  PRESENT: "ob",
  ABSENT: "nb",
  EXCUSED: "zw",
  LATE: "sp",
  JUSTIFIED: "u",
};

const getAttendanceStyle = (status: string) => {
  switch (status) {
    case "ob":
      return { backgroundColor: "#dcfce7", color: "#166534" }; // zielony
    case "nb":
      return { backgroundColor: "#fee2e2", color: "#dc2626" }; // czerwony
    case "zw":
      return { backgroundColor: "#dbeafe", color: "#1d4ed8" }; // niebieski
    case "sp":
      return { backgroundColor: "#fed7aa", color: "#ea580c" }; // pomarańczowy
    case "u":
      return { backgroundColor: "#f3f4f6", color: "#374151" }; // szary
    default:
      return { backgroundColor: "#dcfce7", color: "#166534" }; // domyślnie zielony
  }
};

export default function UczenFrekwencjaPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [lessonTimes, setLessonTimes] = useState<LessonTimeResponse[]>([]);
  const [attendances, setAttendances] = useState<AttendanceResponse[]>([]);
  const [attendancesLoading, setAttendancesLoading] = useState(false);
  const [attendancesError, setAttendancesError] = useState<string | null>(null);

  // Group attendances by date and lesson time
  const attendanceGrid = useMemo(() => {
    const grid: Record<string, Record<string, string>> = {};

    attendances.forEach((attendance) => {
      if (!grid[attendance.lessonDate]) {
        grid[attendance.lessonDate] = {};
      }
      grid[attendance.lessonDate][attendance.lessonTimeId] =
        attendanceStatusLabels[attendance.attendanceStatus] || "";
    });

    return grid;
  }, [attendances]);

  // Group attendance IDs by date and lesson time
  const attendanceIdGrid = useMemo(() => {
    const grid: Record<string, Record<string, string>> = {};

    attendances.forEach((attendance) => {
      if (!grid[attendance.lessonDate]) {
        grid[attendance.lessonDate] = {};
      }
      grid[attendance.lessonDate][attendance.lessonTimeId] = attendance.id;
    });

    return grid;
  }, [attendances]);

  // Get unique dates sorted
  const dates = useMemo(() => {
    return Object.keys(attendanceGrid).sort((a, b) => a.localeCompare(b));
  }, [attendanceGrid]);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.id || !storedUser?.schoolId) {
      setError("Brak informacji o uczniu");
      setLoading(false);
      return;
    }

    const fetchAttendances = async () => {
      setAttendancesLoading(true);
      setAttendancesError(null);

      try {
        // Pobierz godziny lekcyjne szkoły
        const lessonTimesRes = await getLessonTimesBySchoolId(
          storedUser.schoolId!,
        );
        setLessonTimes(lessonTimesRes.data || []);

        // Pobierz obecności ucznia
        const attendancesRes = await getAttendancesByStudentId(storedUser.id!);
        setAttendances(attendancesRes.data || []);
      } catch (err) {
        setAttendancesError("Błąd podczas pobierania frekwencji");
      } finally {
        setAttendancesLoading(false);
      }
    };

    fetchAttendances();
    setLoading(false);
  }, []);

  if (authLoading || loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
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
          Frekwencja
        </h2>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {attendancesLoading ? (
          <div style={{ color: "#6b7280", textAlign: "center" }}>
            Ładowanie frekwencji...
          </div>
        ) : attendancesError ? (
          <div style={{ color: "#ef4444", textAlign: "center" }}>
            {attendancesError}
          </div>
        ) : dates.length === 0 ? (
          <div style={{ color: "#6b7280", textAlign: "center" }}>
            Brak danych frekwencji do wyświetlenia
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {/* Nagłówki */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.5rem",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  color: "#374151",
                  fontSize: "1rem",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                }}
              >
                Data
              </div>
              <div
                style={{
                  fontWeight: "700",
                  color: "#374151",
                  fontSize: "1rem",
                  textAlign: "center",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                }}
              >
                Numery lekcji
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "200px repeat(auto-fit, minmax(40px, 1fr))",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ padding: "0.5rem" }}>
                {/* Puste miejsce pod "Data" */}
              </div>
              {lessonTimes
                .sort((a, b) => a.lessonStart.localeCompare(b.lessonStart))
                .map((lessonTime, index) => (
                  <div
                    key={lessonTime.id}
                    style={{
                      fontWeight: "600",
                      color: "#6b7280",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      padding: "0.5rem",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
            </div>

            {dates.map((date) => (
              <div
                key={date}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "200px repeat(auto-fit, minmax(40px, 1fr))",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f3f4f6",
                    borderRadius: "4px",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    color: "#374151",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {new Date(date).toLocaleDateString("pl-PL")}
                </div>
                {lessonTimes
                  .sort((a, b) => a.lessonStart.localeCompare(b.lessonStart))
                  .map((lessonTime) => {
                    const attendanceId =
                      attendanceIdGrid[date]?.[lessonTime.id];
                    const status = attendanceGrid[date]?.[lessonTime.id] || "";

                    if (attendanceId) {
                      return (
                        <Link
                          key={lessonTime.id}
                          href={`/dashboard/uczen/frekwencja/${attendanceId}`}
                          style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "4px",
                            ...getAttendanceStyle(status),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          {status}
                        </Link>
                      );
                    } else {
                      return (
                        <div
                          key={lessonTime.id}
                          style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "4px",
                            backgroundColor: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#9ca3af",
                          }}
                        >
                          -
                        </div>
                      );
                    }
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
