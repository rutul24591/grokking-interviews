import "./globals.css";

export const metadata = {
  title: "High Availability — Example 1",
  description: "Leader election and failover simulation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

