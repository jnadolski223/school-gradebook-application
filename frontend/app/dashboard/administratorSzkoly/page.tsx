"use client";

import Link from "next/link";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function AdministratorSzkolyPage() {
  const { isAuthorized, isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Brak dostępu</p>
      </div>
    );
  }
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", color: "#3b82f6", marginBottom: "2rem" }}>
        Administrator Szkoły
      </h1>
      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Link href="/dashboard/administratorSzkoly/czlonkowieSzkoly">
          <div
            style={{
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Członkowie szkoły
            </button>
          </div>
        </Link>
        <Link href="/dashboard/administratorSzkoly/klasy">
          <div
            style={{
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Klasy
            </button>
          </div>
        </Link>
        <Link href="/dashboard/administratorSzkoly/przedmioty">
          <div
            style={{
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Przedmioty
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
