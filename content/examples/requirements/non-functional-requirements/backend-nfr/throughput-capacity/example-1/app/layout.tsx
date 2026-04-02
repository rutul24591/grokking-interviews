import "./globals.css";

export const metadata = {
  title: "Throughput capacity — Example 1",
  description: "Micro-batching with throughput stats."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

