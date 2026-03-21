import "./globals.css";

export const metadata = {
  title: "Event Replayability — Example 1",
  description: "Offset log with consumer checkpoints and reset."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

