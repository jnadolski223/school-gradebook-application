"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdministratorSzkolyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Profil", href: "/dashboard/administratorSzkoly/profil" },
    { label: "Członkowie szkoły", href: "/dashboard/administratorSzkoly/czlonkowieSzkoly" },
    { label: "Klasy", href: "/dashboard/administratorSzkoly/klasy" },
    { label: "Przedmioty", href: "/dashboard/administratorSzkoly/przedmioty" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: "1rem 2rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#10b981",
              margin: 0,
              flex: 1,
            }}
          >
            Administrator Szkoły
          </h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {navItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: isActive ? "#10b981" : "#e5e7eb",
                    color: isActive ? "white" : "#1f2937",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontWeight: isActive ? "600" : "500",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        {children}
      </div>
    </div>
  );
}
