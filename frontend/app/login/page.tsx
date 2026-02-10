"use client";

import React, { useState } from "react";
import { loginUser, registerUser, UserRole } from "@/lib/api";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({
    login: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    login: "",
    password: "",
    role: "STUDENT" as UserRole,
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await registerUser(registerForm);
      setSuccess("Zarejestrowano pomyślnie!");
      setRegisterForm({
        login: "",
        password: "",
        role: "STUDENT",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd przy rejestracji");
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
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              color: "#3b82f6",
              marginBottom: "0.5rem",
            }}
          >
            Dziennik Szkolny
          </h1>
        </div>

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
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}
            >
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  fontWeight: isLogin ? "600" : "500",
                  backgroundColor: isLogin ? "#3b82f6" : "#e5e7eb",
                  color: isLogin ? "white" : "#1f2937",
                  border: "none",
                  borderRadius: "6px 0 0 0",
                  cursor: "pointer",
                }}
              >
                Logowanie
              </button>
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  fontWeight: !isLogin ? "600" : "500",
                  backgroundColor: !isLogin ? "#3b82f6" : "#e5e7eb",
                  color: !isLogin ? "white" : "#1f2937",
                  border: "none",
                  borderRadius: "0 6px 0 0",
                  cursor: "pointer",
                }}
              >
                Rejestracja
              </button>
            </div>

            {isLogin ? (
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem",
                    fontWeight: "600",
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
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Login
                    </label>
                    <input
                      type="text"
                      value={loginForm.login}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, login: e.target.value })
                      }
                      required
                      placeholder="Wpisz login"
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Hasło
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      required
                      placeholder="Wpisz hasło"
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
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
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? "Logowanie..." : "Zaloguj się"}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem",
                    fontWeight: "600",
                  }}
                >
                  Rejestracja
                </h2>
                <form
                  onSubmit={handleRegister}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Login
                    </label>
                    <input
                      type="text"
                      value={registerForm.login}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          login: e.target.value,
                        })
                      }
                      required
                      placeholder="Wybierz login"
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Hasło
                    </label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      required
                      placeholder="Wybierz hasło"
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Rola
                    </label>
                    <select
                      value={registerForm.role}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          role: e.target.value as UserRole,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontFamily: "inherit",
                      }}
                    >
                      <option value="STUDENT">Uczeń</option>
                      <option value="PARENT">Rodzic</option>
                      <option value="TEACHER">Nauczyciel</option>
                      <option value="SCHOOL_ADMINISTRATOR">
                        Administrator szkoły
                      </option>
                      <option value="APP_ADMINISTRATOR">
                        Administrator aplikacji
                      </option>
                    </select>
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
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? "Rejestracja..." : "Zarejestruj się"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
