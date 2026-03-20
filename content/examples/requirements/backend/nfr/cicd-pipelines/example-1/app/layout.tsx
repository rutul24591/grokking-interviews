import "./globals.css";

export const metadata = {
  title: "CI/CD Pipelines — Example 1",
  description: "Pipeline runner with gates and smoke tests."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

