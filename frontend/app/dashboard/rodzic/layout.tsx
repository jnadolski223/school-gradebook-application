"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function RodzicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthorized, isLoading } = useProtectedRoute();

  const navItems = [
    { label: "Profil", href: "/dashboard/rodzic/profil" },
    { label: "Oceny", href: "/dashboard/rodzic/oceny" },
    { label: "Plan zajec", href: "/dashboard/rodzic/plan-zajec" },
    {
      label: "Informacje o szkole",
      href: "/dashboard/rodzic/informacje-o-szkole",
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Ladowanie...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Brak dostepu</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
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
              color: "#db2777",
              margin: 0,
              flex: 1,
            }}
          >
            Rodzic
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
                    backgroundColor: isActive ? "#db2777" : "#e5e7eb",
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

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        {children}
      </div>
    </div>
  );
}
