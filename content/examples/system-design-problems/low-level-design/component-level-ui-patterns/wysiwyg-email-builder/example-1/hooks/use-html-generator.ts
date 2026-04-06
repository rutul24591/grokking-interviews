'use client';
import { useCallback, useMemo } from 'react';
import type { Block } from '../lib/email-types';

interface UseHtmlGeneratorOptions {
  blocks: Block[];
  variables?: Record<string, string>;
}

interface UseHtmlGeneratorReturn {
  generateBlockHtml: (block: Block) => string;
  generateFullHtml: () => string;
  generateBodyHtml: () => string;
  blockCount: number;
}

/**
 * Escape HTML special characters for safe string interpolation.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Substitute template variables in a string.
 * Replaces {{variableName}} with the corresponding value.
 */
function substituteVariables(str: string, variables: Record<string, string>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return variables[key] !== undefined ? escapeHtml(variables[key]) : _match;
  });
}

/**
 * Hook for converting email builder blocks into table-based HTML
 * with inline styles (email-client compatible) and variable substitution.
 */
export function useHtmlGenerator({
  blocks,
  variables = {},
}: UseHtmlGeneratorOptions): UseHtmlGeneratorReturn {
  const blockCount = blocks.length;

  /**
   * Generate table-based HTML for a single block with inline styles.
   * Email clients require table-based layouts and inline CSS for
   * maximum compatibility (Gmail, Outlook, Apple Mail, etc.).
   */
  const generateBlockHtml = useCallback(
    (block: Block): string => {
      switch (block.type) {
        case 'text': {
          const content = substituteVariables(
            String(block.config.content ?? ''),
            variables
          );
          const fontSize = block.config.fontSize ?? 14;
          const color = block.config.color ?? '#333333';
          const align = block.config.align ?? 'left';
          const lineHeight = block.config.lineHeight ?? 1.5;
          return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding: 16px; font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; color: ${color}; text-align: ${align}; line-height: ${lineHeight}; mso-line-height-rule: exactly;">
      ${content}
    </td>
  </tr>
</table>`;
        }

        case 'image': {
          const src = String(block.config.src ?? '');
          const alt = substituteVariables(String(block.config.alt ?? 'Image'), variables);
          const width = block.config.width ?? '100%';
          const maxWidth = block.config.maxWidth ?? '600';
          const borderRadius = block.config.borderRadius ?? 0;
          return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding: 8px 16px; text-align: center;">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" style="max-width: ${maxWidth}px; width: ${width}; height: auto; border-radius: ${borderRadius}px; display: block; margin: 0 auto;" />
    </td>
  </tr>
</table>`;
        }

        case 'button': {
          const label = substituteVariables(String(block.config.label ?? 'Click Here'), variables);
          const url = String(block.config.url ?? '#');
          const bgColor = block.config.bgColor ?? '#3b82f6';
          const textColor = block.config.textColor ?? '#ffffff';
          const fontSize = block.config.fontSize ?? 16;
          const borderRadius = block.config.borderRadius ?? 4;
          const paddingX = block.config.paddingX ?? 24;
          const paddingY = block.config.paddingY ?? 12;
          return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding: 16px; text-align: center;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(url)}" style="height:${Number(paddingY) * 2 + Number(fontSize)}px;v-text-anchor:middle;width:200px;" arcsize="${Number(borderRadius) * 2}%" strokecolor="${bgColor}" fillcolor="${bgColor}">
        <w:anchorlock/>
        <center style="color:${textColor};font-family:Arial,sans-serif;font-size:${fontSize}px;font-weight:bold;">${escapeHtml(label)}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${escapeHtml(url)}" style="display: inline-block; padding: ${paddingY}px ${paddingX}px; background-color: ${bgColor}; color: ${textColor}; text-decoration: none; border-radius: ${borderRadius}px; font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; font-weight: bold; mso-padding-alt: 0; text-align: center;">${escapeHtml(label)}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
        }

        case 'divider': {
          const color = block.config.color ?? '#e5e7eb';
          const thickness = block.config.thickness ?? 1;
          const paddingX = block.config.paddingX ?? 16;
          return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding: 8px ${paddingX}px;">
      <hr style="border: none; border-top: ${thickness}px solid ${color}; margin: 0;" />
    </td>
  </tr>
</table>`;
        }

        case 'spacer': {
          const height = block.config.height ?? 16;
          return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="height: ${height}px; font-size: 1px; line-height: ${height}px;">&nbsp;</td>
  </tr>
</table>`;
        }

        default:
          return '';
      }
    },
    [variables]
  );

  /**
   * Generate body HTML (all blocks concatenated).
   */
  const generateBodyHtml = useCallback((): string => {
    return blocks
      .map((block) => generateBlockHtml(block))
      .join('\n');
  }, [blocks, generateBlockHtml]);

  /**
   * Generate full HTML email template with proper DOCTYPE, head styles,
   * and a centered container table for maximum email client compatibility.
   */
  const generateFullHtml = useCallback((): string => {
    const bodyHtml = generateBodyHtml();

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Email</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f4f4f4; }
    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <!-- Centering wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email container -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; margin: 0 auto; max-width: 600px;">
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; font-size: 0;">
${bodyHtml}
            </td>
          </tr>
        </table>
        <!-- /Email container -->
      </td>
    </tr>
  </table>
</body>
</html>`;
  }, [generateBodyHtml]);

  return {
    generateBlockHtml,
    generateFullHtml,
    generateBodyHtml,
    blockCount,
  };
}
