"use client";

import { useEffect, useState } from "react";

type Subject = {
  id?: string;
  schoolId: string;
  name: string;
};

const API_BASE = "http://localhost:8080/api/v1/subjects";

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

async function apiPatch<T>(url: string, body: any) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 204)
    throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 204)
    throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

export default function SubjectsAdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [schoolIdFilter, setSchoolIdFilter] = useState("");
  const [selected, setSelected] = useState<Subject | null>(null);
  const [idInput, setIdInput] = useState("");

  const [createForm, setCreateForm] = useState<Subject>({
    schoolId: "",
    name: "",
  });

  const [updateForm, setUpdateForm] = useState<Subject | null>(null);

  const fetchAll = async () => {
    if (!schoolIdFilter) {
      setError("Podaj ID szkoły do filtrowania");
      setSubjects([]);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await apiGet<{
        status: number;
        message: string;
        data: Subject[];
      }>(`${API_BASE}?schoolId=${schoolIdFilter}`);
      setSubjects(res.data || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolIdFilter) {
      fetchAll();
    }
  }, [schoolIdFilter]);

  const handleGetById = async () => {
    setError(null);
    setSelected(null);
    setUpdateForm(null);
    if (!idInput) return setError("Podaj ID przedmiotu");
    try {
      const res = await apiGet<{
        status: number;
        message: string;
        data: Subject;
      }>(`${API_BASE}/${idInput}`);
      setSelected(res.data);
      setUpdateForm(res.data);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleCreate = async () => {
    setError(null);
    if (!createForm.schoolId) return setError("Podaj ID szkoły");
    if (!createForm.name) return setError("Podaj nazwę przedmiotu");
    try {
      const res = await apiPost<{
        status: number;
        message: string;
        data: Subject;
      }>(API_BASE, {
        schoolId: createForm.schoolId,
        name: createForm.name,
      });
      setSelected(res.data);
      setCreateForm({
        schoolId: createForm.schoolId,
        name: "",
      });
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleUpdate = async () => {
    if (!updateForm || !updateForm.id)
      return setError("Brak danych do aktualizacji");
    if (!updateForm.name)
      return setError("Nazwa przedmiotu nie może być pusta");
    setError(null);
    try {
      const res = await apiPatch<{
        status: number;
        message: string;
        data: Subject;
      }>(`${API_BASE}/${updateForm.id}`, {
        name: updateForm.name,
      });
      setSelected(res.data);
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await apiDelete(`${API_BASE}/${id}`);
      if (selected?.id === id) setSelected(null);
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  return (
    <div>
      <h1>Przedmioty szkolne</h1>

      <div>
        <label>
          ID szkoły do filtrowania:
          <input
            value={schoolIdFilter}
            onChange={(e) => setSchoolIdFilter(e.target.value)}
            placeholder="edd59c34-2ce6-4c18-afbd-5a820674ead7"
          />
        </label>
        <button onClick={fetchAll}>Odśwież listę</button>
      </div>

      <div>
        <strong>Status:</strong>{" "}
        {loading ? "Ładowanie..." : error ? `Błąd: ${error}` : "OK"}
      </div>

      <ul>
        {subjects.map((s) => (
          <li key={s.id}>
            {s.id} — {s.name} (szkoła: {s.schoolId}) —
            <button
              onClick={() => {
                setIdInput(s.id || "");
              }}
            >
              Wybierz
            </button>{" "}
            <button onClick={() => handleDelete(s.id || "")}>Usuń</button>
          </li>
        ))}
      </ul>

      <hr />

      <section>
        <h2>Pobierz przedmiot po id</h2>
        <input
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder="id przedmiotu"
        />
        <button onClick={handleGetById}>Pobierz</button>

        {selected ? (
          <div>
            <h3>Wybrany przedmiot:</h3>
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        ) : null}
      </section>

      <hr />

      <section>
        <h2>Utwórz nowy przedmiot</h2>
        <div>
          <input
            placeholder="ID szkoły"
            value={createForm.schoolId}
            onChange={(e) =>
              setCreateForm({ ...createForm, schoolId: e.target.value })
            }
          />
          <input
            placeholder="Nazwa przedmiotu"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
          />
        </div>
        <button onClick={handleCreate}>Utwórz</button>
      </section>

      <hr />

      <section>
        <h2>Aktualizuj wybrany przedmiot</h2>
        {updateForm ? (
          <div>
            <div>
              <label>
                Nazwa przedmiotu:
                <input
                  placeholder="Nazwa przedmiotu"
                  value={updateForm.name}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, name: e.target.value })
                  }
                />
              </label>
            </div>
            <button onClick={handleUpdate}>Zapisz</button>
          </div>
        ) : (
          <div>Brak wybranego przedmiotu. Pobierz po id aby edytować.</div>
        )}
      </section>
    </div>
  );
}
