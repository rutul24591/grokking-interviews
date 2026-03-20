import "./globals.css";

export const metadata = {
  title: "Disaster Recovery Strategy — Example 1",
  description: "Snapshot + restore simulation (RPO loss)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

