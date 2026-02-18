"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getGradeById,
  getSubjectById,
  GradeResponse,
  GradeType,
  GradeValue,
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

const gradeTypeLabels: Record<GradeType, string> = {
  REGULAR_SEMESTER_1: "Biezaca (semestr 1)",
  FINAL_SEMESTER_1: "Koncowa (semestr 1)",
  REGULAR_SEMESTER_2: "Biezaca (semestr 2)",
  FINAL_SEMESTER_2: "Koncowa (semestr 2)",
  FINAL: "Koncowa",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RodzicOcenaDetailsPage({ params }: PageProps) {
  const { id } = React.use(params);
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [subjectName, setSubjectName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrade = async () => {
      setLoading(true);
      setError(null);

      try {
        const gradeRes = await getGradeById(id);
        setGrade(gradeRes.data);

        try {
          const subjectRes = await getSubjectById(gradeRes.data.subjectId);
          setSubjectName(subjectRes.data.name);
        } catch {
          setSubjectName(null);
        }
      } catch (err) {
        setError("Blad podczas pobierania oceny");
      } finally {
        setLoading(false);
      }
    };

    fetchGrade();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Ladowanie...</p>
      </div>
    );
  }

  if (error || !grade) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#ef4444" }}>{error || "Brak danych oceny"}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link
          href="/dashboard/rodzic/oceny"
          style={{ color: "#db2777", textDecoration: "none" }}
        >
          ← Wroc do ocen
        </Link>
      </div>

      <h2
        style={{
          fontSize: "1.875rem",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "1.5rem",
        }}
      >
        Szczegoly oceny
      </h2>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Przedmiot</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {subjectName || grade.subjectId}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Ocena</div>
          <div style={{ fontWeight: "700", color: "#be185d" }}>
            {gradeValueLabels[grade.gradeValue]}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Typ oceny</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {gradeTypeLabels[grade.gradeType]}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Waga</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {grade.weight}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Wliczana do sredniej
          </div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {grade.countToAverage ? "Tak" : "Nie"}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Opis</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {grade.description || "-"}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Uczen</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {grade.studentId}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Nauczyciel</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {grade.teacherId}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Utworzono</div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {new Date(grade.createdAt).toLocaleString("pl-PL")}
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Zmodyfikowano
          </div>
          <div style={{ fontWeight: "600", color: "#111827" }}>
            {new Date(grade.modifiedAt).toLocaleString("pl-PL")}
          </div>
        </div>
      </div>
    </div>
  );
}
