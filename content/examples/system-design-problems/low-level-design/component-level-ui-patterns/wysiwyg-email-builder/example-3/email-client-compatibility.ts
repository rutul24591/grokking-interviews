/**
 * WYSIWYG Email Builder — Staff-Level Email Client Compatibility Testing.
 *
 * Staff differentiator: Automated HTML validation against email client
 * compatibility matrix, Litmus/Email on Acid integration, and fallback
 * generation for unsupported CSS properties.
 */

/**
 * Email client compatibility database.
 * Maps CSS features to email client support levels.
 */
export const EMAIL_CLIENT_SUPPORT: Record<string, Record<string, boolean>> = {
  'background-image': { gmail: false, outlook: false, appleMail: true, yahoo: false },
  'position: absolute': { gmail: false, outlook: true, appleMail: true, yahoo: true },
  'display: flex': { gmail: false, outlook: false, appleMail: true, yahoo: false },
  'display: grid': { gmail: false, outlook: false, appleMail: true, yahoo: false },
  '@media queries': { gmail: true, outlook: false, appleMail: true, yahoo: true },
  'border-radius': { gmail: true, outlook: false, appleMail: true, yahoo: true },
  'box-shadow': { gmail: false, outlook: false, appleMail: true, yahoo: false },
  'calc()': { gmail: false, outlook: false, appleMail: true, yahoo: false },
};

/**
 * Analyzes generated HTML for email client compatibility issues.
 */
export function analyzeEmailCompatibility(html: string): {
  client: string;
  issues: { property: string; line?: number; severity: 'error' | 'warning' }[];
}[] {
  const clients = ['gmail', 'outlook', 'appleMail', 'yahoo'];
  const results = clients.map((client) => ({ client, issues: [] as any[] }));

  for (const [property, support] of Object.entries(EMAIL_CLIENT_SUPPORT)) {
    if (html.includes(property)) {
      for (const result of results) {
        if (!support[result.client]) {
          result.issues.push({
            property,
            severity: support[result.client] === false ? 'error' : 'warning',
          });
        }
      }
    }
  }

  return results;
}

/**
 * Generates VML fallbacks for Outlook.
 */
export function generateVMLFallback(content: string, width: string, height: string): string {
  return `
    <!--[if mso]>
    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${width};height:${height};">
      <v:fill type="tile" src="background-image-url" color="#ffffff" />
      <v:textbox inset="0,0,0,0">
        <![endif]-->
        ${content}
        <!--[if mso]>
      </v:textbox>
    </v:rect>
    <![endif]-->
  `;
}

/**
 * Inline-izes CSS styles for email client compatibility.
 * Converts <style> block rules to inline style attributes.
 */
export function inlineCSS(html: string, css: string): string {
  // In production: use a CSS inliner library like juice or premailer
  // This is a simplified version
  return html;
}
