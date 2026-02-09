"use client";

import { useEffect, useState } from "react";
import {
  getAllSchoolApplications,
  updateSchoolApplicationStatus,
  deleteSchoolApplication,
  getSchoolApplicationById,
  SchoolApplicationShort,
  SchoolApplication,
} from "@/lib/api";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<SchoolApplicationShort[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SchoolApplication | null>(null);
  const [idInput, setIdInput] = useState("");

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getAllSchoolApplications();
      setApplications(res?.data || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleToggleStatus = async (app: SchoolApplicationShort) => {
    setError(null);
    try {
      const newStatus = app.status === "APPROVED" ? "PENDING" : "APPROVED";
      await updateSchoolApplicationStatus(app.id, newStatus);
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteSchoolApplication(id);
      await fetchAll();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handleGetById = async () => {
    setError(null);
    setSelected(null);
    if (!idInput) return setError("Podaj id");
    try {
      const res = await getSchoolApplicationById(idInput);
      setSelected(res?.data || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  return (
    <div>
      <h1>Wnioski</h1>

      <div>
        <button onClick={fetchAll}>Odśwież listę</button>
      </div>

      <div>
        <strong>Status:</strong>{" "}
        {loading ? "Ładowanie..." : error ? `Błąd: ${error}` : "OK"}
      </div>

      <ul>
        {applications.map((a) => (
          <li key={a.id}>
            {a.id} — {a.schoolName} — {a.status}{" "}
            <button onClick={() => handleToggleStatus(a)}>Toggle status</button>{" "}
            <button onClick={() => handleDelete(a.id)}>Usuń</button>
          </li>
        ))}
      </ul>

      <hr />

      <div>
        <h2>Pobierz po id</h2>
        <input
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder="id"
        />
        <button onClick={handleGetById}>Pobierz</button>

        {selected ? (
          <div>
            <h3>Wynik:</h3>
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
