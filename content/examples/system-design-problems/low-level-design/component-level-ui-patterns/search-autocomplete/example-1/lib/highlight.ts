import type { HighlightSegment } from './autocomplete-types';

/**
 * Escapes special regex characters in a string so it can be used safely in RegExp.
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Splits a suggestion title into segments based on query match.
 * Matched segments get isMatch: true for styling (bold/colored).
 * Non-matching segments get isMatch: false.
 *
 * @param title - The suggestion title text
 * @param query - The search query to match against
 * @returns Array of text segments with match flags
 */
export function highlightText(title: string, query: string): HighlightSegment[] {
  if (!query || query.trim().length === 0) {
    return [{ text: title, isMatch: false }];
  }

  const escapedQuery = escapeRegex(query.trim());
  const regex = new RegExp(escapedQuery, 'gi');
  const segments: HighlightSegment[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(title)) !== null) {
    // Add non-matching text before this match
    if (match.index > lastIndex) {
      segments.push({
        text: title.slice(lastIndex, match.index),
        isMatch: false,
      });
    }

    // Add the matching text
    segments.push({
      text: match[0],
      isMatch: true,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining non-matching text after last match
  if (lastIndex < title.length) {
    segments.push({
      text: title.slice(lastIndex),
      isMatch: false,
    });
  }

  // If no matches found, return the full title as non-match
  if (segments.length === 0) {
    return [{ text: title, isMatch: false }];
  }

  return segments;
}
