"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSchoolApplications,
  deleteSchoolApplication,
  SchoolApplicationShort,
} from "@/lib/api";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<SchoolApplicationShort[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getAllSchoolApplications();
      setApplications(res?.data || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/administratorAplikacji/wnioski/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten wniosek?")) {
      setError(null);
      try {
        await deleteSchoolApplication(id);
        await fetchAll();
      } catch (e: any) {
        setError(e?.message || String(e));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { bg: "#d1fae5", color: "#065f46" };
      case "REJECTED":
        return { bg: "#fee2e2", color: "#991b1b" };
      case "PENDING":
      default:
        return { bg: "#fef3c7", color: "#92400e" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Zatwierdzone";
      case "REJECTED":
        return "Odrzucone";
      case "PENDING":
      default:
        return "Oczekujące";
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

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0, color: "#1f2937", fontSize: "2rem" }}>
          Wnioski
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

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Ładowanie...
        </div>
      ) : (
        /* Applications list */
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {applications.map((app) => {
            const statusStyle = getStatusColor(app.status);
            return (
              <div
                key={app.id}
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
                    {app.schoolName}
                  </h3>

                  {/* Created date */}
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "0.75rem",
                      borderRadius: "6px",
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
                      {formatDate(app.createdAt)}
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
                    minWidth: "220px",
                  }}
                >
                  {/* Status */}
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {getStatusLabel(app.status)}
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(app.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#6b7280",
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
                      onClick={() => handleViewDetails(app.id)}
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
            );
          })}

          {/* Empty state */}
          {applications.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#6b7280",
                backgroundColor: "white",
                borderRadius: "6px",
              }}
            >
              Brak wniosków do wyświetlenia
            </div>
          )}
        </div>
      )}
    </div>
  );
}
