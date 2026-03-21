import "./globals.css";
import { SwRegister } from "@/components/SwRegister";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SwRegister />
        {children}
      </body>
    </html>
  );
}

