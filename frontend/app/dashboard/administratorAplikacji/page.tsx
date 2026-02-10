import Link from "next/link";

export default function AdministratorAplikacjiPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Administrator Aplikacji</h1>
      <div
        style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        <Link href="/dashboard/administratorAplikacji/klasy">
          <button style={{ padding: "8px 12px" }}>Klasy</button>
        </Link>
        <Link href="/dashboard/administratorAplikacji/szkoly">
          <button style={{ padding: "8px 12px" }}>Szkoły</button>
        </Link>
        <Link href="/dashboard/administratorAplikacji/uzytkownicy">
          <button style={{ padding: "8px 12px" }}>Użytkownicy</button>
        </Link>
        <Link href="/dashboard/administratorAplikacji/wnioski">
          <button style={{ padding: "8px 12px" }}>Wnioski</button>
        </Link>
      </div>
    </div>
  );
}
