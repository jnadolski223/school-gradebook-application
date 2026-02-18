"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  createGrade,
  deleteGrade,
  getAllStudents,
  getAllGrades,
  getSchoolClassesBySchoolId,
  getSubjectsBySchoolId,
  GradeType,
  GradeValue,
  GradeResponse,
  SchoolClass,
  StudentResponse,
  Subject,
  updateGrade,
} from "@/lib/api";

const gradeValueOptions: GradeValue[] = [
  "ONE",
  "ONE_PLUS",
  "TWO_MINUS",
  "TWO",
  "TWO_PLUS",
  "THREE_MINUS",
  "THREE",
  "THREE_PLUS",
  "FOUR_MINUS",
  "FOUR",
  "FOUR_PLUS",
  "FIVE_MINUS",
  "FIVE",
  "FIVE_PLUS",
  "SIX_MINUS",
  "SIX",
  "MINUS",
  "PLUS",
  "NO_HOMEWORK",
  "NOT_PREPARED",
  "NOT_CLASSIFIED",
];

const gradeTypeOptions: GradeType[] = [
  "REGULAR_SEMESTER_1",
  "FINAL_SEMESTER_1",
  "REGULAR_SEMESTER_2",
  "FINAL_SEMESTER_2",
  "FINAL",
];

const gradeColumns: Array<{ key: GradeType; label: string }> = [
  { key: "REGULAR_SEMESTER_1", label: "Semestr 1" },
  { key: "FINAL_SEMESTER_1", label: "Koncowa semestr 1" },
  { key: "REGULAR_SEMESTER_2", label: "Semestr 2" },
  { key: "FINAL_SEMESTER_2", label: "Koncowa semestr 2" },
  { key: "FINAL", label: "Ocena koncowa" },
];

const gradeValueLabels: Record<GradeValue, string> = {
  ONE: "1",
  ONE_PLUS: "1+",
  TWO_MINUS: "2-",
  TWO: "2",
  TWO_PLUS: "2+",
  THREE_MINUS: "3-",
  THREE: "3",
  THREE_PLUS: "3+",
  FOUR_MINUS: "4-",
  FOUR: "4",
  FOUR_PLUS: "4+",
  FIVE_MINUS: "5-",
  FIVE: "5",
  FIVE_PLUS: "5+",
  SIX_MINUS: "6-",
  SIX: "6",
  MINUS: "-",
  PLUS: "+",
  NO_HOMEWORK: "Brak pracy domowej",
  NOT_PREPARED: "Nieprzygotowany",
  NOT_CLASSIFIED: "Nieklasyfikowany",
};

const gradeTypeLabels: Record<GradeType, string> = {
  REGULAR_SEMESTER_1: "Biezaca (semestr 1)",
  FINAL_SEMESTER_1: "Koncowa (semestr 1)",
  REGULAR_SEMESTER_2: "Biezaca (semestr 2)",
  FINAL_SEMESTER_2: "Koncowa (semestr 2)",
  FINAL: "Koncowa",
};

export default function NauczycielOcenyPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedGradeValue, setSelectedGradeValue] =
    useState<GradeValue>("FIVE");
  const [selectedGradeType, setSelectedGradeType] =
    useState<GradeType>("REGULAR_SEMESTER_1");
  const [weight, setWeight] = useState("1");
  const [countToAverage, setCountToAverage] = useState(true);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gradesError, setGradesError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);

  const weightNumber = useMemo(() => Number(weight), [weight]);
  const filteredStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter(
      (student) => student.schoolClassId === selectedClassId,
    );
  }, [students, selectedClassId]);
  const groupedGrades = useMemo(() => {
    const map: Record<string, Record<GradeType, GradeResponse[]>> = {};
    grades.forEach((grade) => {
      if (!map[grade.subjectId]) {
        map[grade.subjectId] = {
          REGULAR_SEMESTER_1: [],
          FINAL_SEMESTER_1: [],
          REGULAR_SEMESTER_2: [],
          FINAL_SEMESTER_2: [],
          FINAL: [],
        };
      }
      map[grade.subjectId][grade.gradeType].push(grade);
    });
    Object.values(map).forEach((typeMap) => {
      Object.values(typeMap).forEach((gradeList) => {
        gradeList.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    });
    return map;
  }, [grades]);

  const subjectRows = useMemo(() => {
    return subjects.filter((subject) => groupedGrades[subject.id]);
  }, [subjects, groupedGrades]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userFromStorage?.schoolId) {
        setError("Brak przypisanej szkoly");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const studentsRes = await getAllStudents();
        const schoolStudents = (studentsRes.data || []).filter(
          (student) => student.schoolId === userFromStorage.schoolId,
        );
        setStudents(schoolStudents);

        const classesRes = await getSchoolClassesBySchoolId(
          userFromStorage.schoolId,
        );
        setClasses(classesRes.data || []);
        if (classesRes.data && classesRes.data.length > 0) {
          setSelectedClassId(classesRes.data[0].id);
        }

        const subjectsRes = await getSubjectsBySchoolId(
          userFromStorage.schoolId,
        );
        setSubjects(subjectsRes.data || []);
        if (subjectsRes.data && subjectsRes.data.length > 0) {
          setSelectedSubjectId(subjectsRes.data[0].id);
        }
        const map: Record<string, string> = {};
        (subjectsRes.data || []).forEach((subject) => {
          map[subject.id] = subject.name;
        });
        setSubjectMap(map);
      } catch (err) {
        setError("Blad podczas pobierania danych");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userFromStorage?.schoolId]);

  useEffect(() => {
    if (filteredStudents.length > 0) {
      setSelectedStudentId(filteredStudents[0].schoolMemberId);
    } else {
      setSelectedStudentId("");
    }
  }, [filteredStudents]);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!selectedStudentId) {
        setGrades([]);
        return;
      }

      setGradesLoading(true);
      setGradesError(null);

      try {
        const gradesRes = await getAllGrades(selectedStudentId);
        setGrades(gradesRes.data || []);
      } catch (err) {
        setGradesError("Blad podczas pobierania ocen");
      } finally {
        setGradesLoading(false);
      }
    };

    fetchGrades();
  }, [selectedStudentId]);

  const resetForm = () => {
    setSelectedGradeValue("FIVE");
    setSelectedGradeType("REGULAR_SEMESTER_1");
    setWeight("1");
    setCountToAverage(true);
    setDescription("");
    setEditingGradeId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    if (!userFromStorage?.id) {
      setError("Brak informacji o nauczycielu");
      return;
    }

    if (!selectedClassId || !selectedStudentId || !selectedSubjectId) {
      setError("Wybierz klase, ucznia i przedmiot");
      return;
    }

    if (!Number.isFinite(weightNumber) || weightNumber <= 0) {
      setError("Waga musi byc dodatnia liczba");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        studentId: selectedStudentId,
        teacherId: userFromStorage.id,
        subjectId: selectedSubjectId,
        gradeValue: selectedGradeValue,
        gradeType: selectedGradeType,
        weight: weightNumber,
        countToAverage,
        description: description.trim() ? description.trim() : null,
      };

      if (editingGradeId) {
        await updateGrade(editingGradeId, payload);
        setSuccess("Ocena zostala zaktualizowana");
      } else {
        await createGrade(payload);
        setSuccess("Ocena zostala dodana");
      }

      resetForm();

      const gradesRes = await getAllGrades(selectedStudentId);
      setGrades(gradesRes.data || []);
    } catch (err) {
      setError("Blad podczas zapisu oceny");
    } finally {
      setSaving(false);
    }
  };

  const handleEditGrade = (grade: GradeResponse) => {
    setSelectedSubjectId(grade.subjectId);
    setSelectedGradeValue(grade.gradeValue);
    setSelectedGradeType(grade.gradeType);
    setWeight(String(grade.weight));
    setCountToAverage(grade.countToAverage);
    setDescription(grade.description || "");
    setEditingGradeId(grade.id);
    setSuccess(null);
    setError(null);
  };

  const handleDeleteGrade = async () => {
    if (!editingGradeId) return;
    if (!window.confirm("Czy na pewno chcesz usunac ocene?")) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteGrade(editingGradeId);
      setSuccess("Ocena zostala usunieta");
      resetForm();
      const gradesRes = await getAllGrades(selectedStudentId);
      setGrades(gradesRes.data || []);
    } catch (err) {
      setError("Blad podczas usuwania oceny");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ladowanie...</p>
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
          marginBottom: "1.5rem",
        }}
      >
        Oceny uczniow
      </h2>

      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "6px",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#dcfce7",
            color: "#166534",
            borderRadius: "6px",
            border: "1px solid #bbf7d0",
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
          gap: "2.5rem",
          alignItems: "start",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            display: "grid",
            gap: "1rem",
            alignSelf: "start",
            position: "sticky",
            top: "1.5rem",
            zIndex: 1,
          }}
        >
          <div style={{ fontWeight: "700", color: "#111827" }}>
            {editingGradeId ? "Edytuj ocene" : "Dodaj ocene"}
          </div>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>Klasa</span>
            <select
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            >
              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>Uczen</span>
            <select
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            >
              {filteredStudents.map((student) => (
                <option
                  key={student.schoolMemberId}
                  value={student.schoolMemberId}
                >
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Przedmiot
            </span>
            <select
              value={selectedSubjectId}
              onChange={(event) => setSelectedSubjectId(event.target.value)}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>Ocena</span>
            <select
              value={selectedGradeValue}
              onChange={(event) =>
                setSelectedGradeValue(event.target.value as GradeValue)
              }
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            >
              {gradeValueOptions.map((value) => (
                <option key={value} value={value}>
                  {gradeValueLabels[value]}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Typ oceny
            </span>
            <select
              value={selectedGradeType}
              onChange={(event) =>
                setSelectedGradeType(event.target.value as GradeType)
              }
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            >
              {gradeTypeOptions.map((value) => (
                <option key={value} value={value}>
                  {gradeTypeLabels[value]}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>Waga</span>
            <input
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              type="number"
              min={1}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            />
          </label>

          <label
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={countToAverage}
              onChange={(event) => setCountToAverage(event.target.checked)}
            />
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Wliczana do sredniej
            </span>
          </label>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ color: "#374151", fontWeight: "500" }}>Opis</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
              placeholder="(opcjonalnie)"
            />
          </label>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={
                saving ||
                classes.length === 0 ||
                filteredStudents.length === 0 ||
                subjects.length === 0
              }
              style={{
                padding: "0.75rem 1.25rem",
                backgroundColor: saving ? "#9ca3af" : "#f59e0b",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "1rem",
              }}
            >
              {saving
                ? "Zapisywanie..."
                : editingGradeId
                  ? "Zapisz zmiany"
                  : "Dodaj ocene"}
            </button>

            {editingGradeId && (
              <button
                type="button"
                onClick={handleDeleteGrade}
                disabled={saving}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                }}
              >
                Usun
              </button>
            )}

            {editingGradeId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  fontWeight: "600",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                }}
              >
                Anuluj
              </button>
            )}
          </div>
        </form>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            borderLeft: "4px solid #fed7aa",
            maxWidth: "100%",
            overflowX: "auto",
            justifySelf: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontWeight: "700", color: "#111827" }}>
              Lista ocen ucznia
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Kliknij ocene, aby edytowac
            </div>
          </div>

          {gradesLoading ? (
            <div style={{ color: "#6b7280", textAlign: "center" }}>
              Ladowanie ocen...
            </div>
          ) : gradesError ? (
            <div style={{ color: "#ef4444", textAlign: "center" }}>
              {gradesError}
            </div>
          ) : grades.length === 0 ? (
            <div style={{ color: "#6b7280", textAlign: "center" }}>
              Brak ocen do wyswietlenia
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                width: "max-content",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px repeat(5, 140px)",
                  gap: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#6b7280",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                <div>Przedmiot</div>
                {gradeColumns.map((column) => (
                  <div key={column.key}>{column.label}</div>
                ))}
              </div>

              {subjectRows.map((subject) => (
                <div
                  key={subject.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px repeat(5, 140px)",
                    gap: "0.75rem",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <div style={{ fontWeight: "600", color: "#111827" }}>
                    {subjectMap[subject.id] || subject.name || subject.id}
                  </div>
                  {gradeColumns.map((column) => {
                    const list = groupedGrades[subject.id]?.[column.key] || [];
                    return (
                      <div
                        key={column.key}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {list.length === 0 ? (
                          <span style={{ color: "#9ca3af" }}>-</span>
                        ) : (
                          list.map((grade) => (
                            <button
                              key={grade.id}
                              type="button"
                              onClick={() => handleEditGrade(grade)}
                              style={{
                                padding: "0 0.75rem",
                                borderRadius: "999px",
                                backgroundColor: "#fff7ed",
                                color: "#c2410c",
                                fontWeight: "500",
                                fontSize: "0.9rem",
                                border: "1px solid #fed7aa",
                                cursor: "pointer",
                                minWidth: "52px",
                                height: "32px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title="Kliknij, aby edytowac"
                            >
                              {gradeValueLabels[grade.gradeValue]}
                            </button>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
