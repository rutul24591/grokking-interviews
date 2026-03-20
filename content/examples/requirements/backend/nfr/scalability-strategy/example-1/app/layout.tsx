import "./globals.css";

export const metadata = {
  title: "Scalability Strategy — Example 1",
  description: "Rendezvous hashing and reshard movement."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

