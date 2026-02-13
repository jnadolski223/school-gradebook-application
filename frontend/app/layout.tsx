import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin", "latin-ext"] });

export const metadata = {
  title: "Dziennik Szkolny",
  description: "System zarządzania dziennkiem szkolnym",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
