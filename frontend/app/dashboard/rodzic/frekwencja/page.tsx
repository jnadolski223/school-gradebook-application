"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getAllStudents,
  getLessonTimesBySchoolId,
  getAttendancesByStudentId,
  AttendanceResponse,
  StudentResponse,
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

export default function RodzicFrekwencjaPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
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

  // Get unique dates sorted
  const dates = useMemo(() => {
    return Object.keys(attendanceGrid).sort((a, b) => a.localeCompare(b));
  }, [attendanceGrid]);

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

  useEffect(() => {
    const fetchAttendances = async () => {
      if (!selectedStudentId || !selectedStudent?.schoolId) {
        setAttendances([]);
        return;
      }

      setAttendancesLoading(true);
      setAttendancesError(null);

      try {
        // Pobierz godziny lekcyjne szkoły
        const lessonTimesRes = await getLessonTimesBySchoolId(
          selectedStudent.schoolId,
        );
        setLessonTimes(lessonTimesRes.data || []);

        // Pobierz obecności ucznia
        const attendancesRes =
          await getAttendancesByStudentId(selectedStudentId);
        setAttendances(attendancesRes.data || []);
      } catch (err) {
        setAttendancesError("Błąd podczas pobierania frekwencji");
      } finally {
        setAttendancesLoading(false);
      }
    };

    fetchAttendances();
  }, [selectedStudentId, selectedStudent?.schoolId]);

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
          Frekwencja
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
          attendancesLoading ? (
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
                    .map((lessonTime) => (
                      <div
                        key={lessonTime.id}
                        style={{
                          width: "100%",
                          height: "40px",
                          borderRadius: "4px",
                          ...getAttendanceStyle(
                            attendanceGrid[date]?.[lessonTime.id] || "",
                          ),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        {attendanceGrid[date]?.[lessonTime.id] || ""}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{ color: "#6b7280", textAlign: "center" }}>
            Wybierz ucznia, aby wyświetlić frekwencję
          </div>
        )}
      </div>
    </div>
  );
}
