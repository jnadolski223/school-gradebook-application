"use client";

import React, { useEffect, useState } from "react";

type SchoolClass = {
  id: string;
  schoolId: string;
  homeroomTeacherId: string;
  name: string;
};

export default function AdministratorAplikacjiKlasyPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolIdFilter, setSchoolIdFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SchoolClass | null>(null);
  const [updateName, setUpdateName] = useState("");
  const [updateHomeroomTeacherId, setUpdateHomeroomTeacherId] = useState("");

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/v1/school-classes");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      setClasses(json.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBySchoolId(schoolId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/school-classes?schoolId=${encodeURIComponent(schoolId)}`,
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      setClasses(json.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchById(id: string) {
    setLoading(true);
    setError(null);
    setDetail(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/school-classes/${encodeURIComponent(id)}`,
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      setDetail(json.data ?? null);
      setUpdateName(json.data?.name ?? "");
      setUpdateHomeroomTeacherId(json.data?.homeroomTeacherId ?? "");
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/school-classes/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            homeroomTeacherId: updateHomeroomTeacherId,
            name: updateName,
          }),
        },
      );
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const json = await res.json();
      setDetail(json.data ?? null);
      // refresh list
      await fetchAll();
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this class?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/school-classes/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      if (res.status !== 204) throw new Error(`Delete failed: ${res.status}`);
      setDetail(null);
      setSelectedId(null);
      await fetchAll();
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div>
      <h2>Administrator aplikacji — klasy (GET / PATCH / DELETE)</h2>

      <div>
        <button onClick={() => fetchAll()}>Fetch all classes</button>
      </div>

      <div>
        <label>schoolId filter</label>
        <input
          value={schoolIdFilter}
          onChange={(e) => setSchoolIdFilter(e.target.value)}
        />
        <button onClick={() => fetchBySchoolId(schoolIdFilter)}>
          Fetch by schoolId
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {classes.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> — {c.schoolId} — teacher:{" "}
            {c.homeroomTeacherId}
            <button
              onClick={() => {
                setSelectedId(c.id);
                fetchById(c.id);
              }}
            >
              View
            </button>
          </li>
        ))}
      </ul>

      {detail && (
        <div>
          <h3>Details</h3>
          <pre>{JSON.stringify(detail, null, 2)}</pre>

          <h4>Update (PATCH /api/v1/school-classes/:id)</h4>
          <div>
            <label>name</label>
            <input
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
          </div>
          <div>
            <label>homeroomTeacherId</label>
            <input
              value={updateHomeroomTeacherId}
              onChange={(e) => setUpdateHomeroomTeacherId(e.target.value)}
            />
          </div>
          <button onClick={() => handleUpdate(detail.id)}>Update</button>

          <h4>Delete (DELETE /api/v1/school-classes/:id)</h4>
          <button onClick={() => handleDelete(detail.id)}>Delete</button>
        </div>
      )}

      {selectedId && !detail && (
        <p>Selected {selectedId} — loading detail...</p>
      )}
    </div>
  );
}
