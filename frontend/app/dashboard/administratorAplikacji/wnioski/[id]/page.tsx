"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolApplicationById,
  updateSchoolApplicationStatus,
  SchoolApplication,
} from "@/lib/api";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailsPage({
  params: paramsPromise,
}: PageProps) {
  const { id } = React.use(paramsPromise);
  const router = useRouter();

  const [application, setApplication] = useState<SchoolApplication | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deciding, setDeciding] = useState(false);
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(
    null,
  );

  useEffect(() => {
    const fetchApplication = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await getSchoolApplicationById(id);
        setApplication(res.data);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    setDeciding(true);
    setError(null);
    try {
      await updateSchoolApplicationStatus(id, status);
      setDecision(status);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/administratorAplikacji/wnioski");
      }, 2000);
    } catch (e: any) {
      setError(e?.message || String(e));
      setDeciding(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        Ładowanie...
      </div>
    );
  }

  if (!application) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#991b1b",
        }}
      >
        Nie znaleziono wniosku
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          ← Wróć
        </button>
        <h1
          style={{ margin: "0 0 1rem 0", color: "#1f2937", fontSize: "2rem" }}
        >
          Szczegóły wniosku
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            color: "#991b1b",
            margin: "0 0 1rem 0",
            border: "1px solid #dc2626",
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            borderRadius: "4px",
            borderLeft: "4px solid #dc2626",
          }}
        >
          {error}
        </div>
      )}

      {/* Content card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* Applicant info */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              margin: "0 0 1rem 0",
              color: "#1f2937",
              fontSize: "1.1rem",
            }}
          >
            Dane wnioskodawcy
          </h2>
          <div style={{ color: "#1f2937", lineHeight: "1.8" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Imię i nazwisko:</strong> {application.senderFirstName}{" "}
              {application.senderLastName}
            </div>
            <div>
              <strong>Email:</strong> {application.senderEmail}
            </div>
          </div>
        </div>

        {/* School info */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              margin: "0 0 1rem 0",
              color: "#1f2937",
              fontSize: "1.1rem",
            }}
          >
            Dane szkoły
          </h2>
          <div style={{ color: "#1f2937", lineHeight: "1.8" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Nazwa szkoły:</strong> {application.schoolName}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Adres:</strong> {application.schoolCity},{" "}
              {application.schoolPostalCode}, {application.schoolStreet}
            </div>
            <div>
              <strong>Numer RSPO:</strong> {application.rspoNumber}
            </div>
          </div>
        </div>

        {/* Created date */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              margin: "0 0 1rem 0",
              color: "#1f2937",
              fontSize: "1.1rem",
            }}
          >
            Data i godzina utworzenia
          </h2>
          <div style={{ color: "#1f2937" }}>
            {formatDate(application.createdAt)}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              margin: "0 0 1rem 0",
              color: "#1f2937",
              fontSize: "1.1rem",
            }}
          >
            Opis
          </h2>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderRadius: "6px",
              color: "#1f2937",
              minHeight: "100px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {application.description}
          </div>
        </div>

        {/* Decision section */}
        {decision ? (
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: decision === "APPROVED" ? "#d1fae5" : "#fee2e2",
              color: decision === "APPROVED" ? "#065f46" : "#991b1b",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            {decision === "APPROVED"
              ? "Wniosek został zaakceptowany"
              : "Wniosek został odrzucony"}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => handleDecision("REJECTED")}
              disabled={deciding}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                backgroundColor: "#ef4444",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: deciding ? "not-allowed" : "pointer",
                fontSize: "1rem",
                opacity: deciding ? 0.6 : 1,
              }}
            >
              Odrzuć
            </button>
            <button
              onClick={() => handleDecision("APPROVED")}
              disabled={deciding}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                backgroundColor: "#10b981",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: deciding ? "not-allowed" : "pointer",
                fontSize: "1rem",
                opacity: deciding ? 0.6 : 1,
              }}
            >
              Zaakceptuj
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
