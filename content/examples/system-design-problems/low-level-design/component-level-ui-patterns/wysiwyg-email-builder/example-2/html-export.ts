/**
 * Email Builder HTML Export — Table-based HTML with inline styles for email clients.
 *
 * Interview edge case: Gmail strips <style> tags, Outlook doesn't support
 * modern CSS. The exported HTML must use table-based layout with all styles
 * inlined. Buttons in Outlook need VML fallbacks.
 */

export interface EmailBlock {
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer';
  content: string;
  config?: Record<string, string>;
}

/**
 * Generates table-based HTML with inline styles for email client compatibility.
 */
export function generateEmailHTML(blocks: EmailBlock[], width: number = 600): string {
  const bodyContent = blocks.map((block) => {
    switch (block.type) {
      case 'text':
        return `<tr><td style="padding:16px;font-family:Arial,sans-serif;font-size:14px;color:#333333;">${block.content}</td></tr>`;

      case 'image':
        const src = block.config?.src || '';
        const alt = block.config?.alt || '';
        return `<tr><td style="padding:8px;text-align:center;"><img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border:0;" /></td></tr>`;

      case 'button':
        const url = block.config?.url || '#';
        const label = block.config?.label || 'Click here';
        const bgColor = block.config?.bgColor || '#3b82f6';
        // VML fallback for Outlook
        return `
          <tr><td style="padding:16px;text-align:center;">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${url}" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="${bgColor}">
              <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${label}</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-->
            <a href="${url}" style="display:inline-block;padding:12px 24px;background-color:${bgColor};color:#ffffff;text-decoration:none;border-radius:4px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${label}</a>
            <!--<![endif]-->
          </td></tr>`;

      case 'divider':
        return `<tr><td style="padding:0 16px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>`;

      case 'spacer':
        const height = block.config?.height || '16';
        return `<tr><td style="height:${height}px;font-size:${height}px;line-height:${height}px;">&nbsp;</td></tr>`;

      default:
        return '';
    }
  }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f3f4f6;">
    <tr><td align="center" style="padding:20px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="${width}" style="max-width:${width}px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
        ${bodyContent}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
