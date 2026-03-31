import type { ReactNode } from "react";
import NonCriticalStyles from "./non-critical-styles";

const criticalCss = `
  body { margin: 0; background: #f8f2e8; color: #1f2937; font-family: Georgia, serif; }
  .hero { max-width: 1100px; margin: 0 auto; padding: 56px 24px 24px; }
  .hero-panel { background: rgba(255,255,255,0.86); border: 1px solid rgba(255,255,255,0.74); border-radius: 28px; padding: 28px; box-shadow: 0 24px 70px rgba(95,62,18,0.1); }
  .eyebrow { font: 600 11px/1 system-ui; letter-spacing: .28em; text-transform: uppercase; color: #8b5e34; }
  .hero h1 { margin: 12px 0 0; font-size: clamp(2.8rem, 6vw, 4.7rem); line-height: 1.02; }
  .hero p { margin: 16px 0 0; max-width: 720px; font: 400 16px/1.8 system-ui; color: #475569; }
`;

export const metadata = {
  title: "Critical CSS",
  description: "Inline only the CSS needed for the first viewport.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <NonCriticalStyles />
        {children}
      </body>
    </html>
  );
}
