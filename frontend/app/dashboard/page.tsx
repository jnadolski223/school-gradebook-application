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
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ margin: "16px 0", display: "flex", gap: 10 }}>
        <Link href="/dashboard/administratorAplikacji">
          <button style={{ padding: "8px 12px" }}>
            Administrator Aplikacji
          </button>
        </Link>
        <Link href="/dashboard/administratorSzkoly">
          <button style={{ padding: "8px 12px" }}>Administrator Szkoły</button>
        </Link>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      ></div>
    </div>
  );
}
