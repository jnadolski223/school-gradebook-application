"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  getAllUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  User,
} from "@/lib/api";

export default function DashboardPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", color: "#3b82f6", marginBottom: "2rem" }}>
        Dashboard
      </h1>

      <div
        style={{
          margin: "0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Link href="/dashboard/administratorAplikacji">
          <div
            style={{
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Administrator Aplikacji
            </button>
          </div>
        </Link>
        <Link href="/dashboard/administratorSzkoly">
          <div
            style={{
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Administrator Szkoły
            </button>
          </div>
        </Link>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "none",
        }}
      ></div>
    </div>
  );
}
