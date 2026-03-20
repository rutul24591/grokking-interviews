import "./globals.css";

export const metadata = {
  title: "Traffic management & load shedding — Example 1",
  description: "Admission control with priority shedding."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

