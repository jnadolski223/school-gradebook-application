"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getSchoolClassById,
  getAllSchoolMembers,
  getSubjectsBySchoolId,
  getLessonTimesBySchoolId,
  getAllLessonsBySchoolClassId,
  createLesson,
  updateLesson,
  deleteLesson,
  SchoolClass,
  SchoolMember,
  Subject,
  LessonTimeResponse,
  LessonResponse,
  DayOfWeek,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function PlanLekcjiPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [teachers, setTeachers] = useState<SchoolMember[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessonTimes, setLessonTimes] = useState<LessonTimeResponse[]>([]);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [room, setRoom] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [selectedLessonTime, setSelectedLessonTime] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Edit state
  const [editingLesson, setEditingLesson] = useState<LessonResponse | null>(
    null,
  );
  const [editTeacher, setEditTeacher] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [editDay, setEditDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [editLessonTime, setEditLessonTime] = useState("");
  const [isEditSaving, setIsEditSaving] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      setLoading(false);
      return;
    }
    setSchoolId(storedUser.schoolId);
    if (classId) fetchAllData(storedUser.schoolId);
  }, [classId]);

  async function fetchAllData(schoolIdToFetch: string) {
    setLoading(true);
    setError(null);
    try {
      const [
        classRes,
        teachersRes,
        homeroomRes,
        subjectsRes,
        lessonTimesRes,
        lessonsRes,
      ] = await Promise.all([
        getSchoolClassById(classId),
        getAllSchoolMembers(schoolIdToFetch, "TEACHER"),
        getAllSchoolMembers(schoolIdToFetch, "HOMEROOM_TEACHER"),
        getSubjectsBySchoolId(schoolIdToFetch),
        getLessonTimesBySchoolId(schoolIdToFetch),
        getAllLessonsBySchoolClassId(classId),
      ]);

      setSchoolClass(classRes.data);
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
      setSubjects(subjectsRes.data || []);
      const sorted = [...(lessonTimesRes.data || [])].sort((a, b) =>
        a.lessonStart.localeCompare(b.lessonStart),
      );
      setLessonTimes(sorted);
      setLessons(lessonsRes.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas pobierania danych",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveLesson() {
    if (!selectedTeacher || !selectedSubject || !room || !selectedLessonTime) {
      setSaveMessage("error: Wypełnij wszystkie pola");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const lessonData = {
      teacherId: selectedTeacher,
      schoolClassId: classId,
      subjectId: selectedSubject,
      room,
      lessonTimeId: selectedLessonTime,
      day: selectedDay,
    };

    console.log("Wysyłany JSON:", JSON.stringify(lessonData, null, 2));

    try {
      await createLesson(lessonData);

      setSaveMessage("Lekcja dodana pomyślnie");
      setSelectedTeacher("");
      setSelectedSubject("");
      setRoom("");
      setSelectedDay(DayOfWeek.MONDAY);
      setSelectedLessonTime("");
      setShowForm(false);
    } catch (err) {
      setSaveMessage(
        "error: " +
          (err instanceof Error
            ? err.message
            : "Błąd podczas dodawania lekcji"),
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditLesson(lesson: LessonResponse) {
    setEditingLesson(lesson);
    setEditTeacher(lesson.teacherId);
    setEditSubject(lesson.subjectId);
    setEditRoom(lesson.room);
    setEditDay(lesson.day);
    setEditLessonTime(lesson.lessonTimeId);
  }

  async function handleSaveEditedLesson() {
    if (
      !editingLesson ||
      !editTeacher ||
      !editSubject ||
      !editRoom ||
      !editLessonTime
    ) {
      setSaveMessage("error: Wypełnij wszystkie pola");
      return;
    }

    setIsEditSaving(true);
    setSaveMessage(null);

    try {
      await updateLesson(editingLesson.id, {
        teacherId: editTeacher,
        schoolClassId: editingLesson.schoolClassId,
        subjectId: editSubject,
        room: editRoom,
        lessonTimeId: editLessonTime,
        day: editDay,
      });

      setSaveMessage("success: Lekcja zaktualizowana pomyślnie");
      setEditingLesson(null);
      if (schoolId) {
        await fetchAllData(schoolId);
      }
    } catch (err) {
      setSaveMessage(
        "error: " +
          (err instanceof Error
            ? err.message
            : "Błąd podczas aktualizacji lekcji"),
      );
    } finally {
      setIsEditSaving(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("Czy na pewno chcesz usunąć tę lekcję?")) {
      return;
    }

    setSaveMessage(null);

    try {
      await deleteLesson(lessonId);
      setSaveMessage("success: Lekcja usunięta pomyślnie");
      setEditingLesson(null);
      if (schoolId) {
        await fetchAllData(schoolId);
      }
    } catch (err) {
      setSaveMessage(
        "error: " +
          (err instanceof Error ? err.message : "Błąd podczas usuwania lekcji"),
      );
    }
  }

  function handleCancelEdit() {
    setEditingLesson(null);
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ładowanie...</p>
      </div>
    );
  }

  if (error || !schoolClass) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#ef4444" }}>{error || "Klasa nie znaleziona"}</p>
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            marginTop: "1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.95rem",
            marginBottom: "1rem",
          }}
        >
          ← Wróć
        </button>

        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 0.5rem 0",
          }}
        >
          Plan lekcji: {schoolClass.name}
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
        {/* Komunikaty */}
        {saveMessage && (
          <div
            style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "6px",
              backgroundColor: saveMessage.startsWith("error:")
                ? "#fee2e2"
                : "#dcfce7",
              color: saveMessage.startsWith("error:") ? "#dc2626" : "#16a34a",
              border: saveMessage.startsWith("error:")
                ? "1px solid #fecaca"
                : "1px solid #bbf7d0",
            }}
          >
            {saveMessage.replace("error: ", "").replace("success: ", "")}
          </div>
        )}

        {/* Przycisk dodaj */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSaveMessage(null);
          }}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "2rem",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#059669")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#10b981")
          }
        >
          {showForm ? "Anuluj" : "Dodaj lekcję do planu"}
        </button>

        {/* Formularz */}
        {showForm && (
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "1.5rem",
                margin: "0 0 1.5rem 0",
              }}
            >
              Dodaj nową lekcję
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Nauczyciel */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Nauczyciel prowadzący
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Wybierz nauczyciela</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.userId} value={teacher.userId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Przedmiot */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Przedmiot
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Wybierz przedmiot</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sala */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Numer sali lekcyjnej
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="np. 101"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Dzień tygodnia */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Dzień tygodnia
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={DayOfWeek.MONDAY}>Poniedziałek</option>
                  <option value={DayOfWeek.TUESDAY}>Wtorek</option>
                  <option value={DayOfWeek.WEDNESDAY}>Środa</option>
                  <option value={DayOfWeek.THURSDAY}>Czwartek</option>
                  <option value={DayOfWeek.FRIDAY}>Piątek</option>
                  <option value={DayOfWeek.SATURDAY}>Sobota</option>
                  <option value={DayOfWeek.SUNDAY}>Niedziela</option>
                </select>
              </div>

              {/* Godzina lekcyjna */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Godzina lekcyjna
                </label>
                <select
                  value={selectedLessonTime}
                  onChange={(e) => setSelectedLessonTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Wybierz godzinę</option>
                  {lessonTimes.map((lessonTime, index) => (
                    <option key={lessonTime.id} value={lessonTime.id}>
                      Lekcja {index + 1} ({lessonTime.lessonStart.slice(0, 5)} -{" "}
                      {lessonTime.lessonEnd.slice(0, 5)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Przyciski */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleSaveLesson}
                disabled={isSaving}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: isSaving ? "#d1d5db" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  !isSaving &&
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
                onMouseOut={(e) =>
                  !isSaving &&
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
              >
                {isSaving ? "Zapisywanie..." : "Zapisz"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSaveMessage(null);
                  setSelectedTeacher("");
                  setSelectedSubject("");
                  setRoom("");
                  setSelectedDay(DayOfWeek.MONDAY);
                  setSelectedLessonTime("");
                }}
                disabled={isSaving}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef4444")
                }
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* Formularz edycji */}
        {editingLesson && (
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "1.5rem",
                margin: "0 0 1.5rem 0",
              }}
            >
              Edytuj lekcję
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Nauczyciel */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Nauczyciel prowadzący
                </label>
                <select
                  value={editTeacher}
                  onChange={(e) => setEditTeacher(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Wybierz nauczyciela</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.userId} value={teacher.userId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Przedmiot */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Przedmiot
                </label>
                <select
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Wybierz przedmiot</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sala */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Numer sali lekcyjnej
                </label>
                <input
                  type="text"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  placeholder="np. 101"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Dzień tygodnia */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Dzień tygodnia
                </label>
                <select
                  value={editDay}
                  onChange={(e) => setEditDay(e.target.value as DayOfWeek)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={DayOfWeek.MONDAY}>Poniedziałek</option>
                  <option value={DayOfWeek.TUESDAY}>Wtorek</option>
                  <option value={DayOfWeek.WEDNESDAY}>Środa</option>
                  <option value={DayOfWeek.THURSDAY}>Czwartek</option>
                  <option value={DayOfWeek.FRIDAY}>Piątek</option>
                  <option value={DayOfWeek.SATURDAY}>Sobota</option>
                  <option value={DayOfWeek.SUNDAY}>Niedziela</option>
                </select>
              </div>

              {/* Godzina lekcyjna */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Godzina lekcyjna
                </label>
                <select
                  value={editLessonTime}
                  onChange={(e) => setEditLessonTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Wybierz godzinę</option>
                  {lessonTimes.map((lessonTime, index) => (
                    <option key={lessonTime.id} value={lessonTime.id}>
                      Lekcja {index + 1} ({lessonTime.lessonStart.slice(0, 5)} -{" "}
                      {lessonTime.lessonEnd.slice(0, 5)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Przyciski */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleSaveEditedLesson}
                disabled={isEditSaving}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: isEditSaving ? "#d1d5db" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: isEditSaving ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  !isEditSaving &&
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
                onMouseOut={(e) =>
                  !isEditSaving &&
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
              >
                {isEditSaving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                onClick={() => handleDeleteLesson(editingLesson.id)}
                disabled={isEditSaving}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef4444")
                }
              >
                Usuń lekcję
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isEditSaving}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4b5563")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6b7280")
                }
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

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
                    backgroundColor: "#10b981",
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
                        onClick={() => lesson && handleEditLesson(lesson)}
                        style={{
                          backgroundColor: lesson ? "#dbeafe" : "#f9fafb",
                          border: lesson
                            ? "2px solid #3b82f6"
                            : "1px solid #e5e7eb",
                          padding: "1rem",
                          borderRadius: "6px",
                          minHeight: "100px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          cursor: lesson ? "pointer" : "default",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          if (lesson) {
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.15)";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (lesson) {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "scale(1)";
                          }
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
