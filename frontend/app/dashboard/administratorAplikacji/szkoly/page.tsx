// ...existing code...
"use client";

import { useEffect, useState } from "react";

type SchoolShort = {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
};

type School = {
  id?: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  rspoNumber: string;
  createdAt?: string;
  modifiedAt?: string;
  isActive?: boolean;
};

const API_BASE = "http://localhost:8080/api/v1/schools";

async function apiGet<T>(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function apiPost<T>(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function apiPut<T>(url: string, body: any) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function apiPatch(url: string) {
  const res = await fetch(url, { method: "PATCH" });
  if (!res.ok && res.status !== 204)
    throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 204)
    throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

export default function SchoolsAdminPage() {
  const [schools, setSchools] = useState<SchoolShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiGet<{
        status: number;
        message: string;
        data: SchoolShort[];
      }>(API_BASE);
      setSchools(res.data || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

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

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header with Create button */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Utwórz szkołę
        </button>
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

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Ładowanie...
        </div>
      ) : (
        /* Schools list */
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {schools.map((school) => (
            <div
              key={school.id}
              style={{
                backgroundColor: "white",
                borderRadius: "6px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
              }}
            >
              {/* Left side */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* School name */}
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  {school.name}
                </h3>

                {/* Date tiles */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  {/* Created at */}
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Data i godzina utworzenia
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#1f2937",
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(school.createdAt)}
                    </div>
                  </div>

                  {/* Modified at */}
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Data i godzina aktualizacji
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#1f2937",
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(school.modifiedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginLeft: "2rem",
                  minWidth: "180px",
                }}
              >
                {/* Status */}
                <div
                  style={{
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

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Usuń
                  </button>
                  <button
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Wyświetl
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {schools.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#6b7280",
                backgroundColor: "white",
                borderRadius: "6px",
              }}
            >
              Brak szkół do wyświetlenia
            </div>
          )}
        </div>
      )}
    </div>
  );
}
