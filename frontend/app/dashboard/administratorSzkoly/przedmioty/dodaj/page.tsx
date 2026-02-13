"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSubject } from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function DodajPrzedmiotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      return;
    }
    setSchoolId(storedUser.schoolId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nazwa przedmiotu jest wymagana");
      return;
    }

    if (!schoolId) {
      setError("Brak informacji o szkole");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createSubject({
        schoolId,
        name,
      });

      router.push("/dashboard/administratorSzkoly/przedmioty");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create subject");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/administratorSzkoly/przedmioty");
  };

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
        Dodaj nowy przedmiot
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
