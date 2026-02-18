"use client";

import React, { useEffect, useState } from "react";
import { getUserFromStorage } from "@/lib/auth";
import {
  getLessonTimesBySchoolId,
  createLessonTime,
  deleteLessonTime,
  updateLessonTime,
  LessonTimeResponse,
} from "@/lib/api";

export default function RozkładGodzinPage() {
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [lessonTimes, setLessonTimes] = useState<LessonTimeResponse[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStart, setEditingStart] = useState("");
  const [editingEnd, setEditingEnd] = useState("");
  const [isEditSaving, setIsEditSaving] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      setLoadingLessons(false);
      return;
    }
    setSchoolId(storedUser.schoolId);
    fetchLessonTimes(storedUser.schoolId);
  }, []);

  async function fetchLessonTimes(schoolIdToFetch: string) {
    setLoadingLessons(true);
    setError(null);
    try {
      const response = await getLessonTimesBySchoolId(schoolIdToFetch);
      setLessonTimes(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas pobierania godzin",
      );
    } finally {
      setLoadingLessons(false);
    }
  }

  async function handleAddLessonTime() {
    if (!formStart || !formEnd || !schoolId) {
      setError("Wypełnij wszystkie pola");
      return;
    }

    if (formStart >= formEnd) {
      setError("Godzina zakończenia musi być po godzinie rozpoczęcia");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await createLessonTime({
        schoolId,
        lessonStart: formStart,
        lessonEnd: formEnd,
      });

      setSuccess("Godzina lekcyjna dodana pomyślnie");
      setFormStart("");
      setFormEnd("");
      setShowForm(false);
      await fetchLessonTimes(schoolId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas dodawania godziny",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditStart(lessonTime: LessonTimeResponse) {
    setEditingId(lessonTime.id);
    setEditingStart(lessonTime.lessonStart);
    setEditingEnd(lessonTime.lessonEnd);
    setError(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingStart("");
    setEditingEnd("");
  }

  async function handleSaveEdit() {
    if (!editingStart || !editingEnd) {
      setError("Wypełnij wszystkie pola");
      return;
    }

    if (editingStart >= editingEnd) {
      setError("Godzina zakończenia musi być po godzinie rozpoczęcia");
      return;
    }

    setIsEditSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        await updateLessonTime(editingId, {
          lessonStart: editingStart,
          lessonEnd: editingEnd,
        });

        setSuccess("Godzina lekcyjna zaktualizowana pomyślnie");
        setEditingId(null);
        if (schoolId) {
          await fetchLessonTimes(schoolId);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Błąd podczas aktualizacji godziny",
      );
    } finally {
      setIsEditSaving(false);
    }
  }

  async function handleDeleteLessonTime(lessonTimeId: string) {
    if (!confirm("Czy na pewno chcesz usunąć tę godzinę lekcyjną?")) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await deleteLessonTime(lessonTimeId);
      setSuccess("Godzina lekcyjna usunięta pomyślnie");
      if (schoolId) {
        await fetchLessonTimes(schoolId);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas usuwania godziny",
      );
    }
  }

  if (error && !schoolId) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  // Sortuj godziny lekcji po godzinie początkowej
  const sortedLessonTimes = [...lessonTimes].sort((a, b) => {
    return a.lessonStart.localeCompare(b.lessonStart);
  });

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 0" }}>
      {/* Komunikaty */}
      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            backgroundColor: "#dcfce7",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        >
          {success}
        </div>
      )}

      {/* Przycisk dodaj */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setError(null);
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
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
      >
        {showForm ? "Anuluj" : "Dodaj godzinę lekcyjną"}
      </button>

      {/* Formularz dodania */}
      {showForm && (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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
            Dodaj nową godzinę lekcyjną
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
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
                Godzina rozpoczęcia
              </label>
              <input
                type="time"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
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
                Godzina zakończenia
              </label>
              <input
                type="time"
                value={formEnd}
                onChange={(e) => setFormEnd(e.target.value)}
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
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleAddLessonTime}
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
                !isSaving && (e.currentTarget.style.backgroundColor = "#059669")
              }
              onMouseOut={(e) =>
                !isSaving && (e.currentTarget.style.backgroundColor = "#10b981")
              }
            >
              {isSaving ? "Dodawanie..." : "Dodaj"}
            </button>
          </div>
        </div>
      )}

      {/* Lista godzin lekcji */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {loadingLessons ? (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}
          >
            Ładowanie godzin lekcji...
          </div>
        ) : sortedLessonTimes.length === 0 ? (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}
          >
            Brak godzin lekcji. Dodaj pierwszą godzinę lekcyjną.
          </div>
        ) : (
          <div>
            {sortedLessonTimes.map((lessonTime, index) => (
              <div key={lessonTime.id}>
                {editingId === lessonTime.id ? (
                  // Tryb edycji
                  <div
                    style={{
                      padding: "1.5rem 2rem",
                      borderBottom:
                        index < sortedLessonTimes.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1rem",
                      alignItems: "flex-end",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Start
                      </label>
                      <input
                        type="time"
                        value={editingStart}
                        onChange={(e) => setEditingStart(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Koniec
                      </label>
                      <input
                        type="time"
                        value={editingEnd}
                        onChange={(e) => setEditingEnd(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isEditSaving}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: isEditSaving ? "#d1d5db" : "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          cursor: isEditSaving ? "not-allowed" : "pointer",
                          flex: 1,
                        }}
                      >
                        Zapisz
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isEditSaving}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          flex: 1,
                        }}
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                ) : (
                  // Tryb wyświetlania
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.5rem 2rem",
                      borderBottom:
                        index < sortedLessonTimes.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      Lekcja {index + 1}
                    </div>

                    <div
                      style={{
                        fontSize: "1.125rem",
                        color: "#374151",
                        fontWeight: "500",
                      }}
                    >
                      {lessonTime.lessonStart.slice(0, 5)} -{" "}
                      {lessonTime.lessonEnd.slice(0, 5)}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditStart(lessonTime)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2563eb")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3b82f6")
                        }
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDeleteLessonTime(lessonTime.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
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
                        Usuń
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
