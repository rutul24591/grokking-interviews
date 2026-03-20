import "./globals.css";

export const metadata = {
  title: "Consistency Model — Example 1",
  description: "Leader/follower with replication delay and session consistency."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

