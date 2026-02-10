"use client";

import { useEffect, useState } from "react";

type UserShort = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
};

type User = {
  id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  role?: string;
  isActive?: boolean;
};

const API_BASE = "http://localhost:8080/api/v1/users";

async function apiGet<T>(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function apiPatch<T>(url: string, body?: any) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 204)
    throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return null;
  return (await res.json()) as T;
}

async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 204)
    throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterActive, setFilterActive] = useState<string>("all");
  const [selected, setSelected] = useState<User | null>(null);
  const [idInput, setIdInput] = useState("");

  const [updateForm, setUpdateForm] = useState<User | null>(null);

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const url =
        API_BASE + (filterActive === "all" ? "" : `?active=${filterActive}`);
      const res = await apiGet<{
        status: number;
        message: string;
        data: UserShort[];
      }>(url);
      setUsers(res.data || []);
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
        data: User;
      }>(`${API_BASE}/${idInput}`);
      setSelected(res.data);
      setUpdateForm(res.data);
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
        firstName: updateForm.firstName,
        lastName: updateForm.lastName,
      };
      const res = await apiPatch<{
        status: number;
        message: string;
        data: User;
      }>(`${API_BASE}/${updateForm.id}`, payload);
      if (res) {
        setSelected(res.data);
        await fetchAll();
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleActivate = async (id: string) => {
    setError(null);
    try {
      await apiPatch(`${API_BASE}/${id}/activate`);
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleDeactivate = async (id: string) => {
    setError(null);
    try {
      await apiPatch(`${API_BASE}/${id}/deactivate`);
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
      <h1>Użytkownicy</h1>

      <div>
        <button onClick={fetchAll}>Odśwież</button>
        <label style={{ marginLeft: 8 }}>
          Filtr aktywności:
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">Wszyscy</option>
            <option value="true">Aktywni</option>
            <option value="false">Nieaktywni</option>
          </select>
        </label>
      </div>

      <div>
        <strong>Status:</strong>{" "}
        {loading ? "Ładowanie..." : error ? `Błąd: ${error}` : "OK"}
      </div>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.id} — {u.firstName} {u.lastName} ({u.email}) — {u.role} —{" "}
            {u.isActive ? "aktywny" : "nieaktywny"} —
            <button
              onClick={() => {
                setIdInput(u.id);
              }}
            >
              Wybierz
            </button>{" "}
            <button onClick={() => handleActivate(u.id)}>Aktywuj</button>{" "}
            <button onClick={() => handleDeactivate(u.id)}>Dezaktywuj</button>{" "}
            <button onClick={() => handleDelete(u.id)}>Usuń</button>
          </li>
        ))}
      </ul>

      <hr />

      <section>
        <h2>Pobierz użytkownika po id</h2>
        <input
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder="id"
        />
        <button onClick={handleGetById}>Pobierz</button>

        {selected ? (
          <div>
            <h3>Wybrany użytkownik:</h3>
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        ) : null}
      </section>

      <hr />

      <section>
        <h2>Aktualizuj wybranego użytkownika</h2>
        {updateForm ? (
          <div>
            <div>
              <input
                placeholder="Imię"
                value={updateForm.firstName}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, firstName: e.target.value })
                }
              />
              <input
                placeholder="Nazwisko"
                value={updateForm.lastName}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, lastName: e.target.value })
                }
              />
            </div>
            <button onClick={handleUpdate}>Zapisz</button>
          </div>
        ) : (
          <div>Brak wybranego użytkownika. Pobierz po id aby edytować.</div>
        )}
      </section>
    </div>
  );
}
