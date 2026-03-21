import "./globals.css";

export const metadata = {
  title: "Durability Guarantees — Example 1",
  description: "WAL-backed durable writes vs memory ack."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

