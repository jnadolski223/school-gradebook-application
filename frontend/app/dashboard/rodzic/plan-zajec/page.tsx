"use client";

import React, { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getAllStudents,
  getAllLessonsBySchoolClassId,
  getSubjectsBySchoolId,
  getLessonTimesBySchoolId,
  getAllSchoolMembers,
  SchoolMember,
  LessonResponse,
  LessonTimeResponse,
  Subject,
  StudentResponse,
  DayOfWeek,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function RodzicPlanZajecPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessonTimes, setLessonTimes] = useState<LessonTimeResponse[]>([]);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [teachers, setTeachers] = useState<SchoolMember[]>([]);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.id || !storedUser?.schoolId) {
      setError("Brak informacji o rodzicu lub szkole");
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
    if (!selectedStudent?.schoolClassId || !userFromStorage?.schoolId) {
      return;
    }

    fetchAllData(userFromStorage.schoolId, selectedStudent.schoolClassId);
  }, [selectedStudent, userFromStorage?.schoolId]);

  async function fetchAllData(schoolIdToFetch: string, classId: string) {
    setLoading(true);
    setError(null);
    try {
      const [
        subjectsRes,
        lessonTimesRes,
        lessonsRes,
        teachersRes,
        homeroomRes,
      ] = await Promise.all([
        getSubjectsBySchoolId(schoolIdToFetch),
        getLessonTimesBySchoolId(schoolIdToFetch),
        getAllLessonsBySchoolClassId(classId),
        getAllSchoolMembers(schoolIdToFetch, "TEACHER"),
        getAllSchoolMembers(schoolIdToFetch, "HOMEROOM_TEACHER"),
      ]);

      setSubjects(subjectsRes.data || []);
      const sorted = [...(lessonTimesRes.data || [])].sort((a, b) =>
        a.lessonStart.localeCompare(b.lessonStart),
      );
      setLessonTimes(sorted);
      setLessons(lessonsRes.data || []);

      const combinedTeachers = [
        ...(teachersRes.data ?? []),
        ...(homeroomRes.data ?? []),
      ];
      const uniqueTeachers = Array.from(
        new Map(
          combinedTeachers.map((teacher) => [teacher.userId, teacher]),
        ).values(),
      );
      setTeachers(uniqueTeachers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas pobierania danych",
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
          Plan Zajęć
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
        {/* Plan lekcji */}
        {lessons.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#f3f4f6",
              borderRadius: "6px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ margin: "0" }}>Brak lekcji w planie</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {/* Nagłówek z dniami tygodnia */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "150px repeat(7, 1fr)",
                gap: "1px",
                marginBottom: "2rem",
              }}
            >
              <div style={{ backgroundColor: "#f3f4f6" }}></div>
              {[
                { day: "MONDAY", name: "Poniedziałek" },
                { day: "TUESDAY", name: "Wtorek" },
                { day: "WEDNESDAY", name: "Środa" },
                { day: "THURSDAY", name: "Czwartek" },
                { day: "FRIDAY", name: "Piątek" },
                { day: "SATURDAY", name: "Sobota" },
                { day: "SUNDAY", name: "Niedziela" },
              ].map((dayObj) => (
                <div
                  key={dayObj.day}
                  style={{
                    backgroundColor: "#db2777",
                    color: "white",
                    padding: "1rem",
                    fontWeight: "600",
                    textAlign: "center",
                    borderRadius: "6px",
                  }}
                >
                  {dayObj.name}
                </div>
              ))}

              {/* Wiersze z godzinami i lekcjami */}
              {lessonTimes.map((lessonTime, index) => (
                <React.Fragment key={lessonTime.id}>
                  {/* Godzina po lewej */}
                  <div
                    style={{
                      backgroundColor: "#e5e7eb",
                      padding: "1rem",
                      fontWeight: "600",
                      textAlign: "center",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index + 1}. {lessonTime.lessonStart.slice(0, 5)}-
                    {lessonTime.lessonEnd.slice(0, 5)}
                  </div>

                  {/* Pola dla każdego dnia */}
                  {[
                    DayOfWeek.MONDAY,
                    DayOfWeek.TUESDAY,
                    DayOfWeek.WEDNESDAY,
                    DayOfWeek.THURSDAY,
                    DayOfWeek.FRIDAY,
                    DayOfWeek.SATURDAY,
                    DayOfWeek.SUNDAY,
                  ].map((day) => {
                    const lesson = lessons.find(
                      (l) => l.day === day && l.lessonTimeId === lessonTime.id,
                    );
                    const subject = lesson
                      ? subjects.find((s) => s.id === lesson.subjectId)
                      : null;
                    const teacher = lesson
                      ? teachers.find((t) => t.userId === lesson.teacherId)
                      : null;

                    return (
                      <div
                        key={`${day}-${lessonTime.id}`}
                        style={{
                          backgroundColor: lesson ? "#fce7f3" : "#f9fafb",
                          border: lesson
                            ? "2px solid #db2777"
                            : "1px solid #e5e7eb",
                          padding: "1rem",
                          borderRadius: "6px",
                          minHeight: "100px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          cursor: "default",
                          transition: "all 0.2s",
                        }}
                      >
                        {lesson && subject && teacher ? (
                          <>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#1f2937",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {subject.name}
                            </div>
                            <div
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {teacher.firstName} {teacher.lastName}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#9ca3af",
                              }}
                            >
                              sala {lesson.room}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "#d1d5db" }}>-</div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
