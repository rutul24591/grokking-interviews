import "./globals.css";

export const metadata = {
  title: "Schema Governance — Example 1",
  description: "Registry + compatibility checks."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

