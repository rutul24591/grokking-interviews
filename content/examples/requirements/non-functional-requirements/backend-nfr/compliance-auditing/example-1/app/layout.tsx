import "./globals.css";

export const metadata = {
  title: "Compliance Auditing — Example 1",
  description: "Tamper-evident audit log with hash chaining."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

