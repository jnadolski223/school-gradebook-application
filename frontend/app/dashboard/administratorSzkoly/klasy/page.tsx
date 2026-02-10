"use client";

import React, { useState } from "react";

type SchoolClass = {
  id: string;
  schoolId: string;
  homeroomTeacherId: string;
  name: string;
};

export default function AdministratorSzkolyKlasyPage() {
  const [schoolId, setSchoolId] = useState("");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<SchoolClass | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8080/api/v1/school-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, homeroomTeacherId, name }),
      });

      if (res.status === 201) {
        const json = await res.json();
        setResult(json.data ?? null);
      } else {
        const text = await res.text();
        throw new Error(`Unexpected status ${res.status}: ${text}`);
      }
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Utwórz nową klasę szkolną (POST /api/v1/school-classes)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>schoolId</label>
          <input
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
          />
        </div>
        <div>
          <label>homeroomTeacherId</label>
          <input
            value={homeroomTeacherId}
            onChange={(e) => setHomeroomTeacherId(e.target.value)}
          />
        </div>
        <div>
          <label>name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          Create
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h3>Created (201)</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
