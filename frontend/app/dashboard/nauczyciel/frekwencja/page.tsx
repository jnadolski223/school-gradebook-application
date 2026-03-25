"use client";

import React, { useState, useEffect } from "react";
import {
  getSchoolClassesBySchoolId,
  getLessonTimesBySchoolId,
  getAllStudents,
  createAttendance,
  getAttendancesByStudentId,
  updateAttendance,
  AttendanceStatus,
  AttendanceResponse,
  SchoolClass,
  LessonTimeResponse,
  StudentResponse,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function NauczycielFrekwencjaPage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [lessonTimes, setLessonTimes] = useState<LessonTimeResponse[]>([]);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, AttendanceResponse>
  >({});
  const [showAttendance, setShowAttendance] = useState(false);
  const [isExistingAttendance, setIsExistingAttendance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      setLoading(false);
      return;
    }
    fetchData(storedUser.schoolId);
  }, []);

  async function fetchData(targetSchoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const [classesResult, lessonTimesResult] = await Promise.all([
        getSchoolClassesBySchoolId(targetSchoolId),
        getLessonTimesBySchoolId(targetSchoolId),
      ]);
      setClasses(classesResult.data);
      setLessonTimes(lessonTimesResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const handleConfirm = async () => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      return;
    }

    if (!selectedClass || !selectedHour || !selectedDate) {
      setError("Wybierz klasę, godzinę i datę przed zatwierdzeniem");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const studentsResult = await getAllStudents(selectedClass);
      const studentsList = studentsResult.data;
      setStudents(studentsList);

      // Pobierz attendance dla każdego studenta
      const attendanceMapTemp: Record<string, AttendanceResponse> = {};
      const attendanceStatusMap: Record<string, string> = {};

      for (const student of studentsList) {
        try {
          const attendanceRes = await getAttendancesByStudentId(
            student.schoolMemberId,
          );
          const attendanceForDate = attendanceRes.data.find(
            (a) =>
              a.lessonTimeId === selectedHour && a.lessonDate === selectedDate,
          );
          if (attendanceForDate) {
            attendanceMapTemp[student.schoolMemberId] = attendanceForDate;
            attendanceStatusMap[student.schoolMemberId] =
              attendanceForDate.attendanceStatus;
          } else {
            attendanceStatusMap[student.schoolMemberId] = "PRESENT";
          }
        } catch {
          attendanceStatusMap[student.schoolMemberId] = "PRESENT";
        }
      }

      // Sprawdź czy mamy attendance dla co najmniej jednego studenta
      const hasAnyRecords = Object.keys(attendanceMapTemp).length > 0;

      setAttendanceMap(attendanceMapTemp);
      setAttendance(attendanceStatusMap);
      setIsExistingAttendance(hasAnyRecords);
      setIsEditing(false);
      setShowAttendance(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttendance = async () => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.id) {
      setError("Brak informacji o nauczycielu");
      return;
    }

    if (!selectedClass || !selectedHour || !selectedDate) {
      setError("Wybierz klasę, godzinę i datę przed zapisaniem obecności");
      return;
    }

    if (!students.length) {
      setError("Brak uczniów do zapisania obecności");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isEditing && isExistingAttendance) {
        // Edycja: aktualizuj istniejące + dodaj brakujące
        const updatePromises = students.map((student) => {
          const attendanceRecord = attendanceMap[student.schoolMemberId];
          const status =
            (attendance[student.schoolMemberId] as AttendanceStatus) ||
            "PRESENT";

          if (attendanceRecord) {
            // Aktualizuj istniejący rekord
            return updateAttendance(attendanceRecord.id, {
              teacherId: storedUser.id,
              attendanceStatus: status,
            });
          } else {
            // Dodaj nowy rekord
            return createAttendance({
              teacherId: storedUser.id,
              studentId: student.schoolMemberId,
              lessonTimeId: selectedHour,
              lessonDate: selectedDate,
              attendanceStatus: status,
            });
          }
        });

        await Promise.all(updatePromises);
        setSuccessMessage("Lista obecności została zaktualizowana pomyślnie.");
      } else {
        // Dodanie nowych rekorów
        const attendanceRecords = students.map((student) => ({
          teacherId: storedUser.id,
          studentId: student.schoolMemberId,
          lessonTimeId: selectedHour,
          lessonDate: selectedDate,
          attendanceStatus:
            (attendance[student.schoolMemberId] as AttendanceStatus) ||
            "PRESENT",
        }));

        await Promise.all(
          attendanceRecords.map((record) => createAttendance(record)),
        );
        setSuccessMessage("Lista obecności została zapisana pomyślnie.");
      }

      setShowAttendance(false);
      setStudents([]);
      setAttendance({});
      setAttendanceMap({});
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas zapisywania listy obecności",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#1f2937",
        }}
      >
        Frekwencja
      </h2>

      {error && (
        <div
          style={{
            padding: "12px",
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
      {successMessage && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            backgroundColor: "#dcfce7",
            color: "#166534",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {successMessage}
        </div>
      )}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Wybierz klasę
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          >
            <option value="">Wybierz klasę</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Wybierz godzinę lekcyjną
          </label>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          >
            <option value="">Wybierz godzinę</option>
            {lessonTimes.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.lessonStart} - {lesson.lessonEnd}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Wybierz datę
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleConfirm}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Zatwierdź wybór
        </button>
      </div>

      {showAttendance && (
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#1f2937",
            }}
          >
            {isExistingAttendance && !isEditing
              ? "Istniejąca lista obecności"
              : "Lista obecności"}
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Nr w dzienniku
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Imię i nazwisko
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.schoolMemberId}>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {student.firstName} {student.lastName}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <select
                        value={attendance[student.schoolMemberId]}
                        onChange={(e) =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.schoolMemberId]: e.target.value,
                          }))
                        }
                        disabled={isExistingAttendance && !isEditing}
                        style={{
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          width: "100%",
                          backgroundColor:
                            isExistingAttendance && !isEditing
                              ? "#f3f4f6"
                              : "white",
                          cursor:
                            isExistingAttendance && !isEditing
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <option value="PRESENT">obecny</option>
                        <option value="ABSENT">nieobecny</option>
                        <option value="EXCUSED">zwolniony</option>
                        <option value="LATE">spóźniony</option>
                        <option value="JUSTIFIED">usprawiedliwiony</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            {!isEditing && isExistingAttendance && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Edytuj listę obecności
              </button>
            )}
            {(isEditing || !isExistingAttendance) && (
              <button
                onClick={handleSubmitAttendance}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {isEditing
                  ? "Zaktualizuj listę obecności"
                  : "Zatwierdź listę obecności"}
              </button>
            )}
            <button
              onClick={() => {
                setShowAttendance(false);
                setStudents([]);
                setAttendance({});
                setAttendanceMap({});
                setIsEditing(false);
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
