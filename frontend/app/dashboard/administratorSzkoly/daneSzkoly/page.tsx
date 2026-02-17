"use client";

import React, { useEffect, useState } from "react";
import { getSchoolById, updateSchool, School } from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

export default function DaneSzkolyPage() {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rspoNumber: "",
    city: "",
    postalCode: "",
    street: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      setLoading(false);
      return;
    }

    fetchSchool(storedUser.schoolId);
  }, []);

  async function fetchSchool(targetSchoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await getSchoolById(targetSchoolId);
      setSchool(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load school");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
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
      </div>
    );
  }

  if (!school) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Brak danych szkoly</p>
      </div>
    );
  }

  const startEditing = () => {
    setForm({
      name: school.name,
      rspoNumber: school.rspoNumber,
      city: school.city,
      postalCode: school.postalCode,
      street: school.street,
      phoneNumber: school.phoneNumber || "",
      email: school.email || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!school) return;

    if (!form.name.trim()) {
      setError("Nazwa szkoly jest wymagana");
      return;
    }
    if (!form.rspoNumber.trim()) {
      setError("Numer RSPO jest wymagany");
      return;
    }
    if (!form.city.trim()) {
      setError("Miasto jest wymagane");
      return;
    }
    if (!form.postalCode.trim()) {
      setError("Kod pocztowy jest wymagany");
      return;
    }
    if (!form.street.trim()) {
      setError("Ulica jest wymagana");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const response = await updateSchool(school.id, {
        name: form.name,
        rspoNumber: form.rspoNumber,
        city: form.city,
        postalCode: form.postalCode,
        street: form.street,
        phoneNumber: form.phoneNumber || undefined,
        email: form.email || undefined,
      });
      setSchool(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update school");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#1f2937",
        }}
      >
        Dane szkoly
      </h2>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {!isEditing ? (
          <>
            <div style={{ marginBottom: "12px" }}>
              <strong>Nazwa:</strong> {school.name}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Adres:</strong> {school.street}, {school.postalCode}{" "}
              {school.city}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Telefon:</strong> {school.phoneNumber || "Brak"}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Email:</strong> {school.email || "Brak"}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>RSPO:</strong> {school.rspoNumber}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Aktywna:</strong> {school.isActive ? "Tak" : "Nie"}
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={startEditing}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Edytuj
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Nazwa
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Numer RSPO
              </label>
              <input
                type="text"
                value={form.rspoNumber}
                onChange={(e) =>
                  setForm({ ...form, rspoNumber: e.target.value })
                }
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Miasto
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Kod pocztowy
              </label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Ulica
              </label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Numer telefonu
              </label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isSaving ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {isSaving ? "Zapisywanie..." : "Zapisz"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Anuluj
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
