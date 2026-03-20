import "./globals.css";

export const metadata = {
  title: "Secrets Management — Example 1",
  description: "Key ring rotation with kid."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

