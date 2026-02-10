import Link from "next/link";

export default function AdministratorSzkolyPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Administrator Szkoły</h1>
      <div
        style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        <Link href="/dashboard/administratorSzkoly/czlonkowieSzkoly">
          <button style={{ padding: "8px 12px" }}>Członkowie szkoły</button>
        </Link>
        <Link href="/dashboard/administratorSzkoly/klasy">
          <button style={{ padding: "8px 12px" }}>Klasy</button>
        </Link>
        <Link href="/dashboard/administratorSzkoly/przedmioty">
          <button style={{ padding: "8px 12px" }}>Przedmioty</button>
        </Link>
      </div>
    </div>
  );
}
