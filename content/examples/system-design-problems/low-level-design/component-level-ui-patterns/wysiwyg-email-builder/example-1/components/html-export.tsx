'use client';
import { useState, useCallback } from 'react';

interface HtmlExportProps {
  html: string;
  fileName?: string;
  className?: string;
}

export function HtmlExport({ html, fileName = 'email.html', className = '' }: HtmlExportProps) {
  const [copied, setCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const generateFullHtml = useCallback(
    (bodyContent: string) => {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    img { max-width: 100%; height: auto; }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-container">
${bodyContent}
  </div>
</body>
</html>`;
    },
    []
  );

  const copyToClipboard = useCallback(async () => {
    setExportError(null);
    try {
      const fullHtml = generateFullHtml(html);
      await navigator.clipboard.writeText(fullHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      try {
        const fullHtml = generateFullHtml(html);
        const textarea = document.createElement('textarea');
        textarea.value = fullHtml;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        setExportError('Failed to copy to clipboard');
      }
    }
  }, [html, generateFullHtml]);

  const downloadHtml = useCallback(() => {
    setExportError(null);
    try {
      const fullHtml = generateFullHtml(html);
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.html') ? fileName : `${fileName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setExportError('Failed to download file');
    }
  }, [html, fileName, generateFullHtml]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Export HTML</h3>

      <div className="flex items-center gap-2">
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
            copied
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
              : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
          aria-label="Copy HTML to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>

        <button
          onClick={downloadHtml}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          aria-label="Download HTML file"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>

      {exportError && (
        <p className="text-xs text-red-500" role="alert">{exportError}</p>
      )}

      {/* HTML preview (collapsible) */}
      <details className="mt-1">
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          View raw HTML
        </summary>
        <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-48 font-mono whitespace-pre-wrap break-all">
          {generateFullHtml(html)}
        </pre>
      </details>
    </div>
  );
}
