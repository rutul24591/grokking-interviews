import "./globals.css";

export const metadata = {
  title: "Idempotency Guarantees — Example 1",
  description: "Idempotency-Key backed de-dupe for safe retries."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

