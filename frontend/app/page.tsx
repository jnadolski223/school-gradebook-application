import React from "react";
import Link from "next/link";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>STRONA GŁÓWNA</h1>
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <Link href="/login">
          <button style={{ padding: "10px 16px" }}>Zaloguj</button>
        </Link>
        <Link href="/wniosek">
          <button style={{ padding: "10px 16px" }}>Złóż wniosek</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
