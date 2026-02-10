"use client";

import React, { useState } from "react";
import {
  getAllUsers,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
  User,
  UserRole,
  UserUpdateRequest,
} from "@/lib/api";

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">(
    "all",
  );

  const [selectedUserId, setSelectedUserId] = useState("");
  const [updateForm, setUpdateForm] = useState<UserUpdateRequest>({});
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Pobierz użytkowników
  const handleGetUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (activeFilter === "true") {
        response = await getAllUsers(true);
      } else if (activeFilter === "false") {
        response = await getAllUsers(false);
      } else {
        response = await getAllUsers();
      }
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd");
    } finally {
      setIsLoading(false);
    }
  };

  // Aktualizuj użytkownika
  const handleUpdate = async () => {
    if (!selectedUserId) {
      setUpdateError("Wybierz użytkownika");
      return;
    }
    setUpdateError(null);
    try {
      await updateUser(selectedUserId, updateForm);
      setUpdateForm({});
      setSelectedUserId("");
      await handleGetUsers();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Błąd");
    }
  };

  // Aktywuj użytkownika
  const handleActivate = async (id: string) => {
    setError(null);
    try {
      await activateUser(id);
      await handleGetUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd");
    }
  };

  // Deaktywuj użytkownika
  const handleDeactivate = async (id: string) => {
    setError(null);
    try {
      await deactivateUser(id);
      await handleGetUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd");
    }
  };

  // Usuń użytkownika
  const handleDeleteUser = async (id: string) => {
    setError(null);
    try {
      await deleteUser(id);
      await handleGetUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard - Zarządzanie użytkownikami</h1>

      {error && (
        <div
          style={{
            color: "red",
            margin: "10px 0",
            border: "1px solid red",
            padding: "10px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as any)}
          style={{ padding: "5px" }}
        >
          <option value="all">Wszyscy</option>
          <option value="true">Aktywni</option>
          <option value="false">Nieaktywni</option>
        </select>
        <button
          onClick={handleGetUsers}
          disabled={isLoading}
          style={{ padding: "10px" }}
        >
          {isLoading ? "Ładowanie..." : "Pobierz użytkowników"}
        </button>
      </div>

      {users.length > 0 && (
        <div
          style={{
            marginBottom: "30px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h2>Lista użytkowników ({users.length})</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Login
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Rola
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Aktywny
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                    {user.login}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                    {user.role}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                    {user.isActive ? "Tak" : "Nie"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                    <button
                      onClick={() => setSelectedUserId(user.id)}
                      style={{ marginRight: "5px", padding: "5px" }}
                    >
                      Edytuj
                    </button>
                    {user.isActive ? (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        style={{ marginRight: "5px", padding: "5px" }}
                      >
                        Deaktywuj
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user.id)}
                        style={{ marginRight: "5px", padding: "5px" }}
                      >
                        Aktywuj
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ padding: "5px" }}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          marginBottom: "30px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h2>Aktualizuj użytkownika</h2>
        {updateError && (
          <div
            style={{
              color: "red",
              margin: "10px 0",
              border: "1px solid red",
              padding: "10px",
            }}
          >
            {updateError}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "400px",
          }}
        >
          <div>
            <label>ID użytkownika do edycji:</label>
            <input
              type="text"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
              placeholder="Wpisz ID użytkownika"
            />
          </div>
          <div>
            <label>Nowy login (opcjonalnie):</label>
            <input
              type="text"
              value={updateForm.login || ""}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  login: e.target.value || undefined,
                })
              }
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
          <div>
            <label>Nowe hasło (optcjonalnie):</label>
            <input
              type="password"
              value={updateForm.password || ""}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  password: e.target.value || undefined,
                })
              }
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
          <div>
            <label>Nowa rola (opcjonalnie):</label>
            <select
              value={updateForm.role || ""}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  role: (e.target.value as UserRole) || undefined,
                })
              }
              style={{ width: "100%", padding: "5px" }}
            >
              <option value="">Bez zmian</option>
              <option value="STUDENT">Uczeń</option>
              <option value="PARENT">Rodzic</option>
              <option value="TEACHER">Nauczyciel</option>
              <option value="SCHOOL_ADMINISTRATOR">Administrator szkoły</option>
              <option value="APP_ADMINISTRATOR">Administrator aplikacji</option>
            </select>
          </div>
          <button onClick={handleUpdate} style={{ padding: "10px" }}>
            Zaktualizuj
          </button>
        </div>
      </div>
    </div>
  );
}
