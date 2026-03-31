import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Above-the-Fold Optimization",
  description: "Production-oriented example of critical path optimization.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="deferred-analytics" strategy="afterInteractive">
          {`window.__analyticsQueue = window.__analyticsQueue || []; window.__analyticsQueue.push({ event: "page_view" });`}
        </Script>
      </body>
    </html>
  );
}

