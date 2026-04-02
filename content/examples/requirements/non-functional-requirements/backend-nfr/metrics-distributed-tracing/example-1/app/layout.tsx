import "./globals.css";

export const metadata = {
  title: "Metrics & Distributed Tracing — Example 1",
  description: "Traceparent parsing and span recording."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

