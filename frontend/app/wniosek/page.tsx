"use client";

import { useEffect, useState } from "react";

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

  const handleCreate = async () => {
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
    <div>
      <h1>Utwórz nowy wniosek</h1>

      {error && <div style={{ color: "red" }}>Błąd: {error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <section>
        <h2>Formularz wniosku</h2>
        <div>
          <input
            placeholder="Imię"
            value={createForm.senderFirstName}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                senderFirstName: e.target.value,
              })
            }
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
          />
          <input
            placeholder="Nazwa szkoły"
            value={createForm.schoolName}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                schoolName: e.target.value,
              })
            }
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
          />
          <input
            placeholder="Miasto"
            value={createForm.schoolCity}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                schoolCity: e.target.value,
              })
            }
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
          />
          <textarea
            placeholder="Opis"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                description: e.target.value,
              })
            }
          />
        </div>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Tworzę..." : "Utwórz wniosek"}
        </button>
      </section>

      {created && (
        <>
          <hr />
          <section>
            <h2>Utworzony wniosek:</h2>
            <pre>{JSON.stringify(created, null, 2)}</pre>
          </section>
        </>
      )}
    </div>
  );
}
