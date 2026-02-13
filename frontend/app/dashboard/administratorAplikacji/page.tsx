"use client";

import Link from "next/link";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function AdministratorAplikacjiPage() {
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
    <div
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    ></div>
  );
}
