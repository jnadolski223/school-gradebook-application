import React from "react";
import Link from "next/link";

function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          color: "#3b82f6",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Dziennik Szkolny
      </h1>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/login">
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Zaloguj
          </button>
        </Link>
        <Link href="/wniosek">
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#e5e7eb",
              color: "#1f2937",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Złóż wniosek
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
