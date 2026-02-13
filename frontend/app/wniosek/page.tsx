"use client";

import { useState } from "react";
import Link from "next/link";

type SchoolApplication = {
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  schoolName: string;
  schoolStreet: string;
  schoolPostalCode: string;
  schoolCity: string;
  rspoNumber: string;
  description: string;
};

type SchoolApplicationResponse = {
  id: string;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  schoolName: string;
  schoolStreet: string;
  schoolPostalCode: string;
  schoolCity: string;
  rspoNumber: string;
  description: string;
  createdAt: string;
  status: string;
};

const API_BASE = "http://localhost:8080/api/v1/school-applications";

async function apiPost<T>(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export default function ApplicationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [created, setCreated] = useState<SchoolApplicationResponse | null>(
    null,
  );

  const [createForm, setCreateForm] = useState<SchoolApplication>({
    senderFirstName: "",
    senderLastName: "",
    senderEmail: "",
    schoolName: "",
    schoolStreet: "",
    schoolPostalCode: "",
    schoolCity: "",
    rspoNumber: "",
    description: "",
  });

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);
    setCreated(null);

    if (!createForm.senderFirstName) return setError("Podaj Imię");
    if (!createForm.senderLastName) return setError("Podaj Nazwisko");
    if (!createForm.senderEmail) return setError("Podaj Email");
    if (!createForm.schoolName) return setError("Podaj Nazwę szkoły");
    if (!createForm.schoolStreet) return setError("Podaj Ulicę");
    if (!createForm.schoolPostalCode) return setError("Podaj Kod pocztowy");
    if (!createForm.schoolCity) return setError("Podaj Miasto");
    if (!createForm.rspoNumber) return setError("Podaj Numer RSPO");
    if (!createForm.description) return setError("Podaj Opis");

    setLoading(true);
    try {
      const res = await apiPost<{
        status: number;
        message: string;
        data: SchoolApplicationResponse;
      }>(API_BASE, createForm);
      setCreated(res.data);
      setSuccess("Wniosek został pomyślnie utworzony!");
      setCreateForm({
        senderFirstName: "",
        senderLastName: "",
        senderEmail: "",
        schoolName: "",
        schoolStreet: "",
        schoolPostalCode: "",
        schoolCity: "",
        rspoNumber: "",
        description: "",
      });
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ width: "100%", maxWidth: "680px" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
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

          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1.5rem",
              fontWeight: "600",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Wypełnij wniosek o rejestrację szkoły
          </h2>

          <form
            onSubmit={handleCreate}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontWeight: "600", color: "#374151" }}>
                Dane wnioskodawcy
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "nowrap",
                }}
              >
                <input
                  placeholder="Imię"
                  value={createForm.senderFirstName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      senderFirstName: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  placeholder="Nazwisko"
                  value={createForm.senderLastName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      senderLastName: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  placeholder="Email"
                  value={createForm.senderEmail}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      senderEmail: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontWeight: "600", color: "#374151" }}>
                Dane szkoły
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "nowrap",
                }}
              >
                <input
                  placeholder="Nazwa szkoły"
                  value={createForm.schoolName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      schoolName: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  placeholder="Numer RSPO"
                  value={createForm.rspoNumber}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      rspoNumber: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontWeight: "600", color: "#374151" }}>
                Adres szkoły
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "nowrap",
                }}
              >
                <input
                  placeholder="Miasto"
                  value={createForm.schoolCity}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      schoolCity: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  placeholder="Kod pocztowy"
                  value={createForm.schoolPostalCode}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      schoolPostalCode: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  placeholder="Ulica"
                  value={createForm.schoolStreet}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      schoolStreet: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "0.625rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <textarea
              placeholder="Opis"
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  description: e.target.value,
                })
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.625rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                minHeight: "140px",
                resize: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "space-between",
              }}
            >
              <Link
                href="/login"
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
                }}
              >
                Wróć do logowania
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {loading ? "Tworzę..." : "Zatwierdź"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
