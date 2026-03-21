import "./globals.css";

export const metadata = {
  title: "Data Retention & Archival — Example 1",
  description: "Retention engine with archive/delete and legal holds."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

