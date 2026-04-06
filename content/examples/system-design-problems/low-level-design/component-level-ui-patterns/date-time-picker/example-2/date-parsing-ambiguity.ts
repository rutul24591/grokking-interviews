/**
 * Ambiguous Date Format Parsing — Handles MM/DD vs DD/MM ambiguity.
 *
 * Interview edge case: User enters "03/04/2024". Is this March 4th or April 3rd?
 * The system must detect ambiguity, use locale-aware parsing, and validate
 * against impossible dates (month > 12, day > 31, Feb 30).
 */

export interface ParsedDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  isAmbiguous: boolean;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Detects the likely date format from a string.
 * Handles: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, DD-MM-YYYY.
 */
export function parseDate(input: string, locale: string = 'en-US'): ParsedDate | null {
  const cleaned = input.trim();

  // ISO 8601: YYYY-MM-DD (unambiguous)
  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch.map(Number);
    return validateAndReturn(year, month, day, false, 'high');
  }

  // Slash-separated: MM/DD/YYYY or DD/MM/YYYY
  const slashMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, a, b, year] = slashMatch.map(Number);
    const isUSFormat = locale.startsWith('en-US');

    if (a > 12) {
      // First number can't be a month — must be DD/MM/YYYY
      return validateAndReturn(year, b, a, false, 'high');
    }
    if (b > 12) {
      // Second number can't be a month — must be MM/DD/YYYY
      return validateAndReturn(year, a, b, false, 'high');
    }

    // Both could be valid — ambiguous
    const month = isUSFormat ? a : b;
    const day = isUSFormat ? b : a;
    return validateAndReturn(year, month, day, true, 'medium');
  }

  return null;
}

/**
 * Validates the parsed date and returns null for impossible dates.
 */
function validateAndReturn(
  year: number,
  month: number,
  day: number,
  isAmbiguous: boolean,
  confidence: ParsedDate['confidence'],
): ParsedDate | null {
  if (month < 1 || month > 12) return null;
  if (day < 1) return null;

  // Check days in month (handles leap years)
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return null;

  return { year, month, day, isAmbiguous, confidence };
}

/**
 * Formats a date string according to the user's locale.
 */
export function formatDate(year: number, month: number, day: number, locale: string = 'en-US'): string {
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}
