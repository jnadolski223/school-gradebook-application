"use client";

import React, { useState } from "react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({
    login: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await loginUser(loginForm);
      setSuccess("Zalogowano pomyślnie!");
      console.log("Logged in user:", response.data);
      setLoginForm({ login: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd przy logowaniu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {error && (
            <div
              style={{
                color: "#991b1b",
                margin: "0 0 1rem 0",
                border: "1px solid #dc2626",
                padding: "0.75rem",
                backgroundColor: "#fee2e2",
                borderRadius: "4px",
                borderLeft: "4px solid #dc2626",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                color: "#065f46",
                margin: "0 0 1rem 0",
                border: "1px solid #10b981",
                padding: "0.75rem",
                backgroundColor: "#d1fae5",
                borderRadius: "4px",
                borderLeft: "4px solid #10b981",
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginBottom: "0" }}>
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "1.5rem",
                  fontWeight: "600",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Logowanie
              </h2>
              <form
                onSubmit={handleLogin}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <input
                    type="text"
                    value={loginForm.login}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, login: e.target.value })
                    }
                    required
                    placeholder="Login"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.625rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                    placeholder="Hasło"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.625rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  {isLoading ? "Logowanie..." : "Zaloguj"}
                </button>
              </form>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#e5e7eb",
                  margin: "1.5rem 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: "1rem",
                  flexWrap: "nowrap",
                }}
              >
                <span style={{ color: "#374151", fontWeight: "500" }}>
                  Chcesz założyć swoją szkołę?
                </span>
                <button
                  type="button"
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Złóż wniosek
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
