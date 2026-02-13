"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolClassById,
  updateSchoolClass,
  getAllSchoolMembers,
  updateUser,
  SchoolClass,
  SchoolMember,
} from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

interface TeacherOption extends SchoolMember {
  role?: string;
}

export default function EdytujKlasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: classId } = use(params);
  const router = useRouter();
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [name, setName] = useState("");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [originalTeacherId, setOriginalTeacherId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (!storedUser?.schoolId) {
      setError("Brak informacji o szkole");
      return;
    }
    setSchoolId(storedUser.schoolId);
  }, []);

  useEffect(() => {
    if (!schoolId || !classId) return;
    fetchClassAndTeachers(classId, schoolId);
  }, [schoolId, classId]);

  async function fetchClassAndTeachers(
    targetClassId: string,
    targetSchoolId: string,
  ) {
    setLoading(true);
    setError(null);
    try {
      // Fetch class details
      const classRes = await getSchoolClassById(targetClassId);
      const classData = classRes.data;
      setSchoolClass(classData);
      setName(classData.name);
      setHomeroomTeacherId(classData.homeroomTeacherId);
      setOriginalTeacherId(classData.homeroomTeacherId);

      // Fetch teachers
      const teachersRes = await getAllSchoolMembers(targetSchoolId, "TEACHER");
      setTeachers(teachersRes.data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load class");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nazwa klasy jest wymagana");
      return;
    }

    if (!homeroomTeacherId) {
      setError("Wybierz wychowawcę");
      return;
    }

    if (!schoolClass) {
      setError("Brak danych klasy");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Update the class
      await updateSchoolClass(schoolClass.id, {
        name,
        homeroomTeacherId,
      });

      // If teacher changed, update roles
      if (homeroomTeacherId !== originalTeacherId && originalTeacherId) {
        // Change old teacher role back to TEACHER
        await updateUser(originalTeacherId, { role: "TEACHER" });
      }

      // Set new teacher role to HOMEROOM_TEACHER
      if (homeroomTeacherId !== originalTeacherId) {
        await updateUser(homeroomTeacherId, { role: "HOMEROOM_TEACHER" });
      }

      // Redirect to classes list
      router.push("/dashboard/administratorSzkoly/klasy");
    } catch (e: any) {
      setError(e?.message ?? "Failed to update class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/administratorSzkoly/klasy");
  };

  if (loading && schoolId) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#1f2937",
        }}
      >
        Edytuj klasę
      </h2>

      {error && (
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
      )}

      <form onSubmit={handleSubmit}>
        {/* Class Name */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Nazwa klasy
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. 7C"
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

        {/* Homeroom Teacher */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Wychowawca
          </label>
          <select
            value={homeroomTeacherId}
            onChange={(e) => setHomeroomTeacherId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          >
            <option value="">-- Wybierz wychowawcę --</option>
            {teachers.map((teacher) => (
              <option key={teacher.userId} value={teacher.userId}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Zapisywanie..." : "Zapisz"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}
