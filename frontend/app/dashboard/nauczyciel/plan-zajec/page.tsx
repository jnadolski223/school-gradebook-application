"use client";

import React, { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getAllLessonsByTeacherId,
  getSchoolClassById,
  getSubjectsBySchoolId,
  getLessonTimesBySchoolId,
  LessonResponse,
  LessonTimeResponse,
  Subject,
  SchoolClass,
  DayOfWeek,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function NauczycielPlanZajecPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessonTimes, setLessonTimes] = useState<LessonTimeResponse[]>([]);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<Map<string, SchoolClass>>(
    new Map(),
  );

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.id || !storedUser?.schoolId) {
      setError("Brak informacji o nauczycielu lub szkole");
      setLoading(false);
      return;
    }
    setSchoolId(storedUser.schoolId);
    fetchAllData(storedUser.schoolId, storedUser.id);
  }, []);

  async function fetchAllData(schoolIdToFetch: string, teacherId: string) {
    setLoading(true);
    setError(null);
    try {
      const [subjectsRes, lessonTimesRes, lessonsRes] = await Promise.all([
        getSubjectsBySchoolId(schoolIdToFetch),
        getLessonTimesBySchoolId(schoolIdToFetch),
        getAllLessonsByTeacherId(teacherId),
      ]);

      setSubjects(subjectsRes.data || []);
      const sorted = [...(lessonTimesRes.data || [])].sort((a, b) =>
        a.lessonStart.localeCompare(b.lessonStart),
      );
      setLessonTimes(sorted);
      setLessons(lessonsRes.data || []);

      // Fetch school classes for all lessons
      const classIds = new Set(
        lessonsRes.data?.map((l) => l.schoolClassId) || [],
      );
      const classesMap = new Map<string, SchoolClass>();

      for (const classId of classIds) {
        try {
          const classRes = await getSchoolClassById(classId);
          classesMap.set(classId, classRes.data);
        } catch (err) {
          console.error(`Error fetching class ${classId}:`, err);
        }
      }
      setSchoolClasses(classesMap);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas pobierania danych",
      );
    } finally {
      setLoading(false);
    }
  }

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
      <h2
        style={{
          fontSize: "1.875rem",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "2rem",
          margin: "0 0 2rem 0",
        }}
      >
        Mój Plan Zajęć
      </h2>

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
                    backgroundColor: "#f59e0b",
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
                    const schoolClass = lesson
                      ? schoolClasses.get(lesson.schoolClassId)
                      : null;

                    return (
                      <div
                        key={`${day}-${lessonTime.id}`}
                        style={{
                          backgroundColor: lesson ? "#fef3c7" : "#f9fafb",
                          border: lesson
                            ? "2px solid #f59e0b"
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
                        {lesson && subject && schoolClass ? (
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
                              {schoolClass.name}
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
