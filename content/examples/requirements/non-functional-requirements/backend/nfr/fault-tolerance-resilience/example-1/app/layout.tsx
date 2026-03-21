import "./globals.css";

export const metadata = {
  title: "Fault Tolerance & Resilience — Example 1",
  description: "Retries + circuit breaker + fallback."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

