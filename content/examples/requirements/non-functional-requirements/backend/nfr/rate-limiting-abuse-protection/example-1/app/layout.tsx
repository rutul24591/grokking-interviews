import "./globals.css";

export const metadata = {
  title: "Rate Limiting & Abuse Protection — Example 1",
  description: "Token bucket + penalty box."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

