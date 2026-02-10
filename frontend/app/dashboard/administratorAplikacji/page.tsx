import Link from "next/link";

export default function AdministratorAplikacjiPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", color: "#3b82f6", marginBottom: "2rem" }}>
        Administrator Aplikacji
      </h1>
      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Link href="/dashboard/administratorAplikacji/klasy">
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
              Klasy
            </button>
          </div>
        </Link>
        <Link href="/dashboard/administratorAplikacji/szkoly">
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
              Szkoły
            </button>
          </div>
        </Link>
        <Link href="/dashboard/administratorAplikacji/uzytkownicy">
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
              Użytkownicy
            </button>
          </div>
        </Link>
        <Link href="/dashboard/administratorAplikacji/wnioski">
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
              Wnioski
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
