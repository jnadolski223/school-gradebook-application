"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getSubjectById, updateSubject, Subject } from "@/lib/api";

export default function EdytujPrzedmiotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: subjectId } = use(params);
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;
    fetchSubject(subjectId);
  }, [subjectId]);

  async function fetchSubject(targetSubjectId: string) {
    setLoading(true);
    setError(null);
    try {
      const subjectRes = await getSubjectById(targetSubjectId);
      const subjectData = subjectRes.data;
      setSubject(subjectData);
      setName(subjectData.name);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load subject");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nazwa przedmiotu jest wymagana");
      return;
    }

    if (!subject) {
      setError("Brak danych przedmiotu");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await updateSubject(subject.id, { name });

      router.push("/dashboard/administratorSzkoly/przedmioty");
    } catch (e: any) {
      setError(e?.message ?? "Failed to update subject");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/administratorSzkoly/przedmioty");
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#1f2937",
        }}
      >
        Edytuj przedmiot
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

      <form onSubmit={handleSubmit}>
        {/* Subject Name */}
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
            Nazwa przedmiotu
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nazwa przedmiotu"
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

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 20px",
              backgroundColor: submitting ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {submitting ? "Zapisywanie..." : "Zapisz"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}
