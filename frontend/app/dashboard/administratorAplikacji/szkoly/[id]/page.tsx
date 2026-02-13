"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolById,
  toggleSchoolActivation,
  checkSchoolAdminCreated,
  School,
} from "@/lib/api";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function SchoolDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { user, isLoading: authLoading } = useProtectedRoute();
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminCreated, setIsAdminCreated] = useState<boolean | null>(null);
  const [isTogglingActivation, setIsTogglingActivation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const schoolResponse = await getSchoolById(params.id);
        setSchool(schoolResponse.data);

        const adminResponse = await checkSchoolAdminCreated(params.id);
        setIsAdminCreated(adminResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Błąd podczas pobierania danych",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleToggleActivation = async () => {
    if (!school) return;

    setIsTogglingActivation(true);
    setError(null);

    try {
      await toggleSchoolActivation(school.id);

      // Update local state
      setSchool({
        ...school,
        isActive: !school.isActive,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Błąd podczas zmiany statusu szkoły",
      );
    } finally {
      setIsTogglingActivation(false);
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

  if (authLoading || isLoading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  if (!school) {
    return (
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ← Wróć
        </button>
        <div style={{ color: "#991b1b" }}>
          Nie znaleziono szkoły bądź błąd podczas pobierania danych
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        ← Wróć
      </button>

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

      {/* School information card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          maxWidth: "900px",
        }}
      >
        {/* School name */}
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1f2937",
            marginTop: 0,
            marginBottom: "2rem",
          }}
        >
          {school.name}
        </h2>

        {/* Address section */}
        <div
          style={{
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              marginTop: 0,
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Adres szkoły
          </h3>
          <div style={{ color: "#1f2937", fontSize: "1rem" }}>
            <div>
              {school.city}, {school.postalCode}, {school.street}
            </div>
          </div>
        </div>

        {/* Contact information grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Phone */}
          <div>
            <label
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "600",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Telefon
            </label>
            <p style={{ margin: 0, color: "#1f2937", fontSize: "1rem" }}>
              {school.phoneNumber || "-"}
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "600",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </label>
            <p style={{ margin: 0, color: "#1f2937", fontSize: "1rem" }}>
              {school.email || "-"}
            </p>
          </div>
        </div>

        {/* RSPO Number */}
        <div
          style={{
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <label
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              fontWeight: "600",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Numer RSPO
          </label>
          <p style={{ margin: 0, color: "#1f2937", fontSize: "1rem" }}>
            {school.rspoNumber}
          </p>
        </div>

        {/* Dates section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Created at */}
          <div>
            <label
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "600",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Data i godzina utworzenia
            </label>
            <p style={{ margin: 0, color: "#1f2937", fontSize: "0.95rem" }}>
              {formatDate(school.createdAt)}
            </p>
          </div>

          {/* Modified at */}
          <div>
            <label
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "600",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Data i godzina ostatniej aktualizacji
            </label>
            <p style={{ margin: 0, color: "#1f2937", fontSize: "0.95rem" }}>
              {formatDate(school.modifiedAt)}
            </p>
          </div>
        </div>

        {/* Status and activation button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <label
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "600",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Status aktywności
            </label>
            <div
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: school.isActive ? "#d1fae5" : "#fee2e2",
                color: school.isActive ? "#065f46" : "#991b1b",
                borderRadius: "6px",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              {school.isActive ? "Aktywna" : "Nieaktywna"}
            </div>
          </div>

          <button
            onClick={handleToggleActivation}
            disabled={isTogglingActivation}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: school.isActive ? "#ef4444" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isTogglingActivation ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              opacity: isTogglingActivation ? 0.7 : 1,
            }}
          >
            {school.isActive ? "Dezaktywuj" : "Aktywuj"}
          </button>
        </div>

        {/* School admin section */}
        <div>
          {isAdminCreated === null ? (
            <div style={{ color: "#6b7280" }}>Sprawdzanie...</div>
          ) : isAdminCreated ? (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#d1fae5",
                color: "#065f46",
                borderRadius: "6px",
                fontSize: "0.95rem",
              }}
            >
              Konto administratora szkoły zostało już utworzone
            </div>
          ) : (
            <button
              onClick={() =>
                router.push(
                  `/dashboard/administratorAplikacji/szkoly/${school.id}/utworz-administratora`,
                )
              }
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              Utwórz konto administratora szkoły
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
