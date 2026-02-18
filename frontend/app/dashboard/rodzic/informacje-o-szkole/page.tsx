"use client";

import React, { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getSchoolById, School } from "@/lib/api";

export default function RodzicInformacjeOSzkolePage() {
  const { user: userFromStorage, isLoading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<School | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userFromStorage?.schoolId) {
          setError("Brak przypisanej szkoly");
          return;
        }

        const response = await getSchoolById(userFromStorage.schoolId);
        setSchoolData(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Błąd podczas pobierania danych szkoły",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [userFromStorage?.schoolId]);

  if (authLoading || loading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            color: "#991b1b",
            border: "1px solid #dc2626",
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            borderRadius: "4px",
            borderLeft: "4px solid #dc2626",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h2
        style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1f2937" }}
      >
        Informacje o szkole
      </h2>

      {schoolData && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Nazwa
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.name}
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Numer RSPO
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.rspoNumber}
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Adres
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.street}, {schoolData.postalCode} {schoolData.city}
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Telefon
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.phoneNumber}
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Email
            </label>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#1f2937",
                fontWeight: "500",
              }}
            >
              {schoolData.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
