/**
 * PDF Text Search — In-PDF text extraction and match finding.
 *
 * Interview edge case: User searches for "report" in a 50-page PDF. The system
 * must extract text content from all pages, find all matches, and allow navigation
 * between matches (next/previous). Must handle case sensitivity and whole-word matching.
 */

export interface SearchMatch {
  pageIndex: number;
  text: string;
  offset: number;
  length: number;
}

/**
 * Extracts text content from a page (simulated — in production uses PDF.js).
 */
async function extractPageText(pageIndex: number): Promise<string> {
  // In production: use PDF.js page.getTextContent()
  return `Sample text content for page ${pageIndex + 1}`;
}

/**
 * Searches for text matches across all pages of a PDF.
 */
export async function searchPdf(
  numPages: number,
  query: string,
  options: { caseSensitive?: boolean; wholeWord?: boolean } = {},
): Promise<SearchMatch[]> {
  const { caseSensitive = false, wholeWord = false } = options;
  const matches: SearchMatch[] = [];
  const searchTerm = caseSensitive ? query : query.toLowerCase();

  // Build regex for matching
  const escapedQuery = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = wholeWord ? `\\b${escapedQuery}\\b` : escapedQuery;
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(pattern, flags);

  for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
    const text = await extractPageText(pageIndex);
    const searchText = caseSensitive ? text : text.toLowerCase();

    let match: RegExpExecArray | null;
    while ((match = regex.exec(searchText)) !== null) {
      matches.push({
        pageIndex,
        text: match[0],
        offset: match.index,
        length: match[0].length,
      });
    }
  }

  return matches;
}

/**
 * Returns the page index and text offset for the next/previous match.
 */
export function navigateToMatch(
  matches: SearchMatch[],
  currentIndex: number,
  direction: 'next' | 'prev',
): number {
  if (matches.length === 0) return -1;
  if (direction === 'next') {
    return (currentIndex + 1) % matches.length;
  }
  return (currentIndex - 1 + matches.length) % matches.length;
}
