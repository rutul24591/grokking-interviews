/**
 * Code Editor — Edge Case: Pasted Content Sanitization.
 *
 * When pasting code from external sources (websites, documents), strip formatting,
 * normalize line endings, detect and convert smart quotes, and handle
 * mixed indentation.
 */

/**
 * Sanitizes pasted code content.
 */
export function sanitizePastedCode(raw: string, options: {
  normalizeIndentation?: boolean;
  detectEncoding?: boolean;
  stripFormatting?: boolean;
} = {}): string {
  let content = raw;

  // Strip rich text formatting (HTML tags, RTF codes)
  if (options.stripFormatting) {
    // Remove HTML tags
    content = content.replace(/<[^>]*>/g, '');
    // Remove RTF control words
    content = content.replace(/\\[a-zA-Z]+[0-9]* ?/g, '');
    // Remove Unicode escape sequences from RTF
    content = content.replace(/\\u[0-9]+\??/g, '');
  }

  // Normalize line endings to \n
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Convert smart quotes to regular quotes
  content = content
    .replace(/[\u2018\u2019]/g, "'")  // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes
    .replace(/\u2013/g, '-')           // En dash
    .replace(/\u2014/g, '--')          // Em dash
    .replace(/\u2026/g, '...');        // Ellipsis

  // Normalize indentation: detect most common indent and rebase to spaces
  if (options.normalizeIndentation) {
    content = normalizeIndentation(content);
  }

  // Remove trailing whitespace on each line
  content = content.replace(/[ \t]+$/gm, '');

  // Ensure file ends with newline
  if (content.length > 0 && !content.endsWith('\n')) {
    content += '\n';
  }

  return content;
}

/**
 * Detects the most common indentation pattern and normalizes to 2 spaces.
 */
function normalizeIndentation(code: string): string {
  const lines = code.split('\n');
  const indents: number[] = [];

  for (const line of lines) {
    const match = line.match(/^(\s+)/);
    if (match) {
      // Count spaces (treat tab as 2 spaces)
      const spaceCount = match[1].replace(/\t/g, '  ').length;
      if (spaceCount > 0) indents.push(spaceCount);
    }
  }

  if (indents.length === 0) return code;

  // Find the smallest non-zero indent (the base indent)
  const baseIndent = Math.min(...indents);
  if (baseIndent === 0) return code;

  // Normalize: base indent → 2 spaces
  return lines.map((line) => {
    const match = line.match(/^(\s+)/);
    if (match) {
      const spaceCount = match[1].replace(/\t/g, '  ').length;
      const levels = Math.round(spaceCount / baseIndent);
      return '  '.repeat(levels) + line.trimStart();
    }
    return line;
  }).join('\n');
}
