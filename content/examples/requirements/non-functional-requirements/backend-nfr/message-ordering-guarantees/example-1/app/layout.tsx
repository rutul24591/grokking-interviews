import "./globals.css";

export const metadata = {
  title: "Message Ordering Guarantees — Example 1",
  description: "Per-stream ordered consumption with buffering."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

