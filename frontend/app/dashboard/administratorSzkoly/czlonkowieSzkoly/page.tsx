"use client";

import React, { useEffect, useState } from "react";
import {
  SchoolMember,
  createSchoolMember,
  getAllSchoolMembers,
  updateSchoolMember,
  deleteSchoolMember,
} from "../../../../lib/api";

export default function SchoolMembersPage() {
  const [members, setMembers] = useState<SchoolMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<SchoolMember>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllSchoolMembers();
      setMembers(res.data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        const res = await updateSchoolMember(editingId, {
          firstName: form.firstName,
          lastName: form.lastName,
        } as Partial<SchoolMember>);
        setMembers((m) =>
          m.map((it) => (it.userId === editingId ? res.data : it)),
        );
        setEditingId(null);
      } else {
        // create expects full SchoolMember object
        const payload: SchoolMember = {
          userId: form.userId || "",
          schoolId: form.schoolId || "",
          firstName: form.firstName || "",
          lastName: form.lastName || "",
        };
        const res = await createSchoolMember(payload);
        setMembers((m) => [res.data, ...m]);
      }
      setForm({});
    } catch (e: any) {
      setError(e?.message ?? "Operation failed");
    }
  }

  function startEdit(member: SchoolMember) {
    setEditingId(member.userId);
    setForm(member);
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć tego członka szkoły?")) return;
    try {
      await deleteSchoolMember(id);
      setMembers((m) => m.filter((it) => it.userId !== id));
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete");
    }
  }

  return (
    <div>
      <h1>Członkowie szkoły</h1>

      {error && (
        <div role="alert" style={{ color: "red" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>userId: </label>
          <input
            name="userId"
            value={form.userId ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>schoolId: </label>
          <input
            name="schoolId"
            value={form.schoolId ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>firstName: </label>
          <input
            name="firstName"
            value={form.firstName ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>lastName: </label>
          <input
            name="lastName"
            value={form.lastName ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">{editingId ? "Zapisz" : "Utwórz"}</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({});
              }}
            >
              Anuluj
            </button>
          )}
        </div>
      </form>

      <hr />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>userId</th>
              <th>schoolId</th>
              <th>firstName</th>
              <th>lastName</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.userId}>
                <td>{m.userId}</td>
                <td>{m.schoolId}</td>
                <td>{m.firstName}</td>
                <td>{m.lastName}</td>
                <td>
                  <button onClick={() => startEdit(m)}>Edit</button>
                  <button onClick={() => handleDelete(m.userId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
