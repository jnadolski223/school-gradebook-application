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
    <div>
      <h1>Logowanie i Rejestracja</h1>

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
      {success && (
        <div
          style={{
            color: "green",
            margin: "10px 0",
            border: "1px solid green",
            padding: "10px",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ marginBottom: "20px", padding: "10px" }}
        >
          {isLogin ? "Przejdź do rejestracji" : "Przejdź do logowania"}
        </button>

        {isLogin ? (
          <div>
            <h2>Logowanie</h2>
            <form
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "300px",
              }}
            >
              <div>
                <label>Login:</label>
                <input
                  type="text"
                  value={loginForm.login}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, login: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div>
                <label>Hasło:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{ padding: "10px" }}
              >
                {isLoading ? "Logowanie..." : "Zaloguj się"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Rejestracja</h2>
            <form
              onSubmit={handleRegister}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "300px",
              }}
            >
              <div>
                <label>Login:</label>
                <input
                  type="text"
                  value={registerForm.login}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, login: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div>
                <label>Hasło:</label>
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
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div>
                <label>Rola:</label>
                <select
                  value={registerForm.role}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      role: e.target.value as UserRole,
                    })
                  }
                  style={{ width: "100%", padding: "5px" }}
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
                style={{ padding: "10px" }}
              >
                {isLoading ? "Rejestracja..." : "Zarejestruj się"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
