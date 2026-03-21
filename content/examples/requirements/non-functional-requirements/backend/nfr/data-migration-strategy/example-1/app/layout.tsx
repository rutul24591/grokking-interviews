import "./globals.css";

export const metadata = {
  title: "Data Migration Strategy — Example 1",
  description: "Online migration with phases and backfill."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

