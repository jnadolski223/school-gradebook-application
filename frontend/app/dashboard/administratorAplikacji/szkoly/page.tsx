// ...existing code...
"use client";

import { useEffect, useState } from "react";

type SchoolShort = {
  id: string;
  schoolName: string;
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

  const [filterActive, setFilterActive] = useState<string>("all"); // "all" | "true" | "false"

  const [selected, setSelected] = useState<School | null>(null);
  const [idInput, setIdInput] = useState("");

  const [createForm, setCreateForm] = useState<School>({
    name: "",
    street: "",
    postalCode: "",
    city: "",
    phoneNumber: "",
    email: "",
    rspoNumber: "",
  });

  const [updateForm, setUpdateForm] = useState<School | null>(null);

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const url =
        API_BASE + (filterActive === "all" ? "" : `?active=${filterActive}`);
      const res = await apiGet<{
        status: number;
        message: string;
        data: SchoolShort[];
      }>(url);
      setSchools(res.data || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [filterActive]);

  const handleGetById = async () => {
    setError(null);
    setSelected(null);
    setUpdateForm(null);
    if (!idInput) return setError("Podaj id");
    try {
      const res = await apiGet<{
        status: number;
        message: string;
        data: School;
      }>(`${API_BASE}/${idInput}`);
      setSelected(res.data);
      setUpdateForm(res.data);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleCreate = async () => {
    setError(null);
    try {
      const payload = {
        ...createForm,
        phoneNumber: createForm.phoneNumber ?? "",
        email: createForm.email ?? "",
      };
      const res = await apiPost<{
        status: number;
        message: string;
        data: School;
      }>(API_BASE, payload);
      setSelected(res.data);
      setCreateForm({
        name: "",
        street: "",
        postalCode: "",
        city: "",
        phoneNumber: "",
        email: "",
        rspoNumber: "",
      });
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleUpdate = async () => {
    if (!updateForm || !updateForm.id)
      return setError("Brak danych do aktualizacji");
    setError(null);
    try {
      const payload = {
        name: updateForm.name,
        street: updateForm.street,
        postalCode: updateForm.postalCode,
        city: updateForm.city,
        phoneNumber: updateForm.phoneNumber ?? "",
        email: updateForm.email ?? "",
        rspoNumber: updateForm.rspoNumber,
      };
      const res = await apiPut<{
        status: number;
        message: string;
        data: School;
      }>(`${API_BASE}/${updateForm.id}`, payload);
      setSelected(res.data);
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleActivate = async (id: string, activate = true) => {
    setError(null);
    try {
      await apiPatch(`${API_BASE}/${id}/activate${activate ? "" : ""}`); // endpoint same but backend decides action in this spec; if separate, adjust
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
      <h1>Szkoły (proste)</h1>

      <div>
        <button onClick={fetchAll}>Odśwież</button>
        <label style={{ marginLeft: 8 }}>
          Filtr aktywności:
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="true">Aktywne</option>
            <option value="false">Nieaktywne</option>
          </select>
        </label>
      </div>

      <div>
        <strong>Status:</strong>{" "}
        {loading ? "Ładowanie..." : error ? `Błąd: ${error}` : "OK"}
      </div>

      <ul>
        {schools.map((s) => (
          <li key={s.id}>
            {s.id} — {s.schoolName} — {s.isActive ? "active" : "inactive"} —{" "}
            <button
              onClick={() => {
                setIdInput(s.id);
              }}
            >
              Wybierz
            </button>{" "}
            <button onClick={() => handleActivate(s.id, true)}>Aktywuj</button>{" "}
            <button onClick={() => handleActivate(s.id, false)}>
              Dezaktywuj
            </button>{" "}
            <button onClick={() => handleDelete(s.id)}>Usuń</button>
          </li>
        ))}
      </ul>

      <hr />

      <section>
        <h2>Pobierz szkołę po id</h2>
        <input
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder="id"
        />
        <button onClick={handleGetById}>Pobierz</button>

        {selected ? (
          <div>
            <h3>Wybrana szkoła:</h3>
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        ) : null}
      </section>

      <hr />

      <section>
        <h2>Utwórz nową szkołę</h2>
        <div>
          <input
            placeholder="name"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
          />
          <input
            placeholder="street"
            value={createForm.street}
            onChange={(e) =>
              setCreateForm({ ...createForm, street: e.target.value })
            }
          />
          <input
            placeholder="postalCode"
            value={createForm.postalCode}
            onChange={(e) =>
              setCreateForm({ ...createForm, postalCode: e.target.value })
            }
          />
          <input
            placeholder="city"
            value={createForm.city}
            onChange={(e) =>
              setCreateForm({ ...createForm, city: e.target.value })
            }
          />
          <input
            placeholder="phoneNumber"
            value={createForm.phoneNumber}
            onChange={(e) =>
              setCreateForm({ ...createForm, phoneNumber: e.target.value })
            }
          />
          <input
            placeholder="email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
          />
          <input
            placeholder="rspoNumber"
            value={createForm.rspoNumber}
            onChange={(e) =>
              setCreateForm({ ...createForm, rspoNumber: e.target.value })
            }
          />
        </div>
        <button onClick={handleCreate}>Utwórz</button>
      </section>

      <hr />

      <section>
        <h2>Aktualizuj wybraną szkołę</h2>
        {updateForm ? (
          <div>
            <div>
              <input
                placeholder="name"
                value={updateForm.name}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, name: e.target.value })
                }
              />
              <input
                placeholder="street"
                value={updateForm.street}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, street: e.target.value })
                }
              />
              <input
                placeholder="postalCode"
                value={updateForm.postalCode}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, postalCode: e.target.value })
                }
              />
              <input
                placeholder="city"
                value={updateForm.city}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, city: e.target.value })
                }
              />
              <input
                placeholder="phoneNumber"
                value={updateForm.phoneNumber}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, phoneNumber: e.target.value })
                }
              />
              <input
                placeholder="email"
                value={updateForm.email}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, email: e.target.value })
                }
              />
              <input
                placeholder="rspoNumber"
                value={updateForm.rspoNumber}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, rspoNumber: e.target.value })
                }
              />
            </div>
            <button onClick={handleUpdate}>Zapisz</button>
          </div>
        ) : (
          <div>Brak wybranej szkoły. Pobierz po id aby edytować.</div>
        )}
      </section>
    </div>
  );
}
