"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSchool } from "@/lib/api";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function CreateSchoolPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useProtectedRoute();

  const [formData, setFormData] = useState({
    name: "",
    rspoNumber: "",
    city: "",
    postalCode: "",
    street: "",
    phoneNumber: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Nazwa szkoły jest wymagana");
      return;
    }
    if (!formData.rspoNumber.trim()) {
      setError("Numer RSPO jest wymagany");
      return;
    }
    if (!formData.city.trim()) {
      setError("Miasto jest wymagane");
      return;
    }
    if (!formData.postalCode.trim()) {
      setError("Kod pocztowy jest wymagany");
      return;
    }
    if (!formData.street.trim()) {
      setError("Ulica jest wymagana");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createSchool({
        name: formData.name.trim(),
        rspoNumber: formData.rspoNumber.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        street: formData.street.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        email: formData.email.trim() || undefined,
      });

      setSuccess("Szkoła została utworzona pomyślnie!");

      // Redirect to school details after 2 seconds
      setTimeout(() => {
        router.push(
          `/dashboard/administratorAplikacji/szkoly/${response.data.id}`,
        );
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas tworzenia szkoły",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
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

      {/* Form card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          maxWidth: "900px",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1f2937",
            marginTop: 0,
            marginBottom: "2rem",
          }}
        >
          Tworzenie szkoły
        </h2>

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

        {/* Success message */}
        {success && (
          <div
            style={{
              color: "#065f46",
              margin: "0 0 1rem 0",
              border: "1px solid #10b981",
              padding: "0.75rem",
              backgroundColor: "#d1fae5",
              borderRadius: "4px",
              borderLeft: "4px solid #10b981",
            }}
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleCreateSchool}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Row 1: Name and RSPO Number */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* Name */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Nazwa szkoły *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nazwa szkoły"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* RSPO Number */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Numer RSPO *
              </label>
              <input
                type="text"
                name="rspoNumber"
                value={formData.rspoNumber}
                onChange={handleChange}
                placeholder="Numer RSPO"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Row 2: City, Postal Code, Street */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* City */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Miasto *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Miasto"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Kod pocztowy *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Kod pocztowy"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Street */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Ulica *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Ulica"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Row 3: Phone Number and Email */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* Phone Number */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Numer telefonu
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Numer telefonu (opcjonalnie)"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (opcjonalnie)"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              opacity: isLoading ? 0.7 : 1,
              marginTop: "0.5rem",
            }}
          >
            {isLoading ? "Tworzenie..." : "Utwórz szkołę"}
          </button>
        </form>
      </div>
    </div>
  );
}
