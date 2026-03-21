import "./globals.css";

export const metadata = {
  title: "Latency SLAs — Example 1",
  description: "Budgeted execution with graceful degradation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

