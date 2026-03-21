import "./globals.css";

export const metadata = {
  title: "Cost Optimization — Example 1",
  description: "Cost model with budget guardrails and recommendations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

