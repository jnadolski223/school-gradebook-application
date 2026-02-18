"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getAllGrades,
  getSubjectsBySchoolId,
  GradeResponse,
  GradeType,
  GradeValue,
  Subject,
} from "@/lib/api";

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

const gradeColumns: Array<{ key: GradeType; label: string }> = [
  { key: "REGULAR_SEMESTER_1", label: "Semestr 1" },
  { key: "FINAL_SEMESTER_1", label: "Koncowa semestr 1" },
  { key: "REGULAR_SEMESTER_2", label: "Semestr 2" },
  { key: "FINAL_SEMESTER_2", label: "Koncowa semestr 2" },
  { key: "FINAL", label: "Ocena koncowa" },
];

export default function UczenOcenyPage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const baseSubjects = subjects.length
      ? subjects
      : Object.keys(groupedGrades).map((subjectId) => ({
          id: subjectId,
          schoolId: userFromStorage?.schoolId || "",
          name: subjectMap[subjectId] || subjectId,
        }));
    return baseSubjects.filter((subject) => groupedGrades[subject.id]);
  }, [subjects, groupedGrades, subjectMap, userFromStorage?.schoolId]);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!userFromStorage?.id) {
        setError("Brak informacji o uczniu");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const gradesRes = await getAllGrades(userFromStorage.id);
        setGrades(gradesRes.data || []);

        if (userFromStorage.schoolId) {
          const subjectsRes = await getSubjectsBySchoolId(
            userFromStorage.schoolId,
          );
          setSubjects(subjectsRes.data || []);
          const map: Record<string, string> = {};
          (subjectsRes.data || []).forEach((subject) => {
            map[subject.id] = subject.name;
          });
          setSubjectMap(map);
        }
      } catch (err) {
        setError("Blad podczas pobierania ocen");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [userFromStorage?.id, userFromStorage?.schoolId]);

  if (authLoading || loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ladowanie...</p>
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
          marginBottom: "1.5rem",
        }}
      >
        Oceny
      </h2>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {grades.length === 0 ? (
          <div style={{ color: "#6b7280", textAlign: "center" }}>
            Brak ocen do wyswietlenia
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(180px, 1.6fr) repeat(5, minmax(140px, 1fr))",
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
                  gridTemplateColumns:
                    "minmax(180px, 1.6fr) repeat(5, minmax(140px, 1fr))",
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
                          <Link
                            key={grade.id}
                            href={`/dashboard/uczen/oceny/${grade.id}`}
                            style={{
                              padding: "0 0.75rem",
                              borderRadius: "999px",
                              backgroundColor: "#ede9fe",
                              color: "#6d28d9",
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              textDecoration: "none",
                              minWidth: "52px",
                              height: "32px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {gradeValueLabels[grade.gradeValue]}
                          </Link>
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
  );
}
