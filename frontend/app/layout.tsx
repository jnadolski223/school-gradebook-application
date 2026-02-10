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
      <body>{children}</body>
    </html>
  );
}
