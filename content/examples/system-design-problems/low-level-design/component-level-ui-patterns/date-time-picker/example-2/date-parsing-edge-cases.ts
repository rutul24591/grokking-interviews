/**
 * Date Parsing Edge Cases: Ambiguous Formats (MM/DD vs DD/MM),
 * Invalid Date Handling, Leap Year/Month-End Logic
 *
 * EDGE CASE: Date strings from user input or external sources can be
 * ambiguous or invalid:
 * 1. "03/04/2025" — Is this March 4th (US) or April 3rd (rest of world)?
 * 2. "2025-02-30" — February 30th doesn't exist
 * 3. "2024-02-29" — Valid only in leap years (2024 is leap, 2025 is not)
 * 4. "2025-01-32" — January has 31 days, not 32
 * 5. "01/15/2025 25:30" — Hour 25 doesn't exist
 * 6. JavaScript's `new Date("2025-02-30")` silently rolls over to March 2nd
 *    — this is a MAJOR source of bugs.
 *
 * SOLUTION: Strict date parsing that rejects invalid dates rather than
 * silently rolling over. Detect ambiguous formats and prompt the user.
 * Validate leap years and month boundaries explicitly.
 *
 * INTERVIEW FOLLOW-UP: "What does new Date('2025-02-30') return?"
 * (Answer: March 2, 2025 — JS silently rolls over!)
 */

import { useState, useCallback, useMemo } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface ParsedDate {
  /** Whether parsing was successful */
  valid: boolean;
  /** The parsed Date object (null if invalid) */
  date: Date | null;
  /** The original input string */
  input: string;
  /** Detected or specified format */
  format: DateFormat | null;
  /** Whether the format was ambiguous */
  ambiguous: boolean;
  /** Error message if parsing failed */
  error: string | null;
}

type DateFormat =
  | "YYYY-MM-DD"
  | "MM/DD/YYYY"
  | "DD/MM/YYYY"
  | "DD-MM-YYYY"
  | "YYYY/MM/DD"
  | "MM-DD-YYYY";

interface ParseOptions {
  /**
   * Preferred date format for ambiguous inputs.
   * If not specified, ambiguous dates will return ambiguous: true.
   */
  preferredFormat?: DateFormat;
  /**
   * Whether to allow dates in the future.
   * If false, future dates are flagged as invalid.
   */
  allowFuture?: boolean;
  /**
   * Whether to allow dates in the past.
   * If false, past dates are flagged as invalid.
   */
  allowPast?: boolean;
  /**
   * Minimum allowed date.
   */
  minDate?: Date;
  /**
   * Maximum allowed date.
   */
  maxDate?: Date;
}

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/**
 * Check if a year is a leap year.
 *
 * Leap year rules:
 * - Divisible by 4 → leap year
 * - EXCEPT divisible by 100 → NOT leap year
 * - EXCEPT divisible by 400 → IS leap year
 *
 * Examples: 2024 (yes), 2000 (yes), 1900 (no), 2025 (no)
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the number of days in a month, accounting for leap years.
 */
export function daysInMonth(year: number, month: number): number {
  // month is 1-indexed (1 = January)
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2 && isLeapYear(year)) {
    return 29; // February in leap year
  }

  return daysPerMonth[month - 1];
}

/**
 * Validate that a date's components match the Date object.
 *
 * JavaScript's Date constructor silently rolls over invalid dates:
 *   new Date(2025, 1, 30) → March 2, 2025 (Feb has 28 days in 2025)
 *
 * This function catches that by comparing the constructed date's
 * components back to the original input.
 */
export function validateDateComponents(
  year: number,
  month: number,
  day: number,
  date: Date
): boolean {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 && // JS months are 0-indexed
    date.getDate() === day
  );
}

/**
 * Detect the format of a date string.
 * Returns null if the format can't be determined.
 */
export function detectDateFormat(input: string): DateFormat | null {
  const trimmed = input.trim();

  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(trimmed)) {
    const separator = trimmed[4];
    return separator === "-" ? "YYYY-MM-DD" : "YYYY/MM/DD";
  }

  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(trimmed)) {
    const separator = trimmed[2];
    const first = parseInt(trimmed.slice(0, 2), 10);
    const second = parseInt(trimmed.slice(3, 5), 10);

    // If first > 12, it must be a day (DD/MM)
    if (first > 12) {
      return separator === "-" ? "DD-MM-YYYY" : "DD/MM/YYYY";
    }

    // If second > 12, it must be a day (MM/DD)
    if (second > 12) {
      return separator === "-" ? "MM-DD-YYYY" : "MM/DD/YYYY";
    }

    // Both ≤ 12 — ambiguous!
    return null;
  }

  return null;
}

/**
 * Parse a date string with strict validation.
 * Unlike `new Date()`, this does NOT silently roll over invalid dates.
 */
export function parseDateStrict(
  input: string,
  options: ParseOptions = {}
): ParsedDate {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      valid: false,
      date: null,
      input,
      format: null,
      ambiguous: false,
      error: "Input is empty",
    };
  }

  const detectedFormat = detectDateFormat(trimmed);

  if (!detectedFormat && !options.preferredFormat) {
    // Check if it's an ambiguous case
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(trimmed)) {
      return {
        valid: false,
        date: null,
        input,
        format: null,
        ambiguous: true,
        error:
          "Ambiguous date format. Could be MM/DD/YYYY or DD/MM/YYYY. Please specify the format.",
      };
    }

    return {
      valid: false,
      date: null,
      input,
      format: null,
      ambiguous: false,
      error: `Unrecognized date format: "${trimmed}"`,
    };
  }

  const format = detectedFormat ?? options.preferredFormat!;

  // Extract year, month, day from the string based on detected format
  let year: number, month: number, day: number;

  if (format.startsWith("YYYY")) {
    // YYYY-MM-DD or YYYY/MM/DD
    const parts = trimmed.split(/[/-]/);
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else if (format.startsWith("MM")) {
    // MM/DD/YYYY or MM-DD-YYYY
    const parts = trimmed.split(/[/-]/);
    month = parseInt(parts[0], 10);
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else {
    // DD/MM/YYYY or DD-MM-YYYY
    const parts = trimmed.split(/[/-]/);
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  }

  // Validate ranges
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: "Date contains non-numeric values",
    };
  }

  if (month < 1 || month > 12) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: `Month must be between 1 and 12 (got ${month})`,
    };
  }

  const maxDays = daysInMonth(year, month);
  if (day < 1 || day > maxDays) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: `${month}/${year} has ${maxDays} days (got ${day})`,
    };
  }

  // Construct the date and verify no rollover occurred
  const date = new Date(year, month - 1, day);

  if (!validateDateComponents(year, month, day, date)) {
    // This shouldn't happen after our validation, but defensive check
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: "Date validation failed (unexpected rollover)",
    };
  }

  // Check range constraints
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (options.allowFuture === false && checkDate > now) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: "Future dates are not allowed",
    };
  }

  if (options.allowPast === false && checkDate < now) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: "Past dates are not allowed",
    };
  }

  if (options.minDate && checkDate < options.minDate) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: `Date must be on or after ${options.minDate.toLocaleDateString()}`,
    };
  }

  if (options.maxDate && checkDate > options.maxDate) {
    return {
      valid: false,
      date: null,
      input,
      format,
      ambiguous: false,
      error: `Date must be on or before ${options.maxDate.toLocaleDateString()}`,
    };
  }

  return {
    valid: true,
    date,
    input,
    format,
    ambiguous: false,
    error: null,
  };
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

interface UseDateParserOptions extends ParseOptions {
  /** Initial input string */
  initialValue?: string;
  /** Callback when a valid date is parsed */
  onValidDate?: (date: Date) => void;
}

interface UseDateParserReturn {
  /** Current parsed result */
  parsed: ParsedDate;
  /** Current raw input string */
  input: string;
  /** Update the input string (triggers re-parse) */
  setInput: (value: string) => void;
  /** Whether the current input is valid */
  isValid: boolean;
  /** Whether the format was ambiguous */
  isAmbiguous: boolean;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Hook that provides strict date parsing with React state management.
 *
 * Usage:
 *   const { parsed, input, setInput, isValid, isAmbiguous } = useDateParser({
 *     preferredFormat: "MM/DD/YYYY",
 *     allowFuture: false,
 *   });
 *
 *   <input value={input} onChange={e => setInput(e.target.value)} />
 *   {!isValid && <span className="error">{parsed.error}</span>}
 *   {isAmbiguous && <span className="warning">Please clarify the format</span>}
 */
export function useDateParser({
  initialValue = "",
  onValidDate,
  ...parseOptions
}: UseDateParserOptions = {}): UseDateParserReturn {
  const [input, setInput] = useState(initialValue);

  const parsed = useMemo(
    () => parseDateStrict(input, parseOptions),
    [input, parseOptions]
  );

  const isValid = parsed.valid;
  const isAmbiguous = parsed.ambiguous;

  // Call onValidDate callback when a valid date is parsed
  useMemo(() => {
    if (parsed.valid && parsed.date && onValidDate) {
      onValidDate(parsed.date);
    }
  }, [parsed, onValidDate]);

  const reset = useCallback(() => {
    setInput(initialValue);
  }, [initialValue]);

  return {
    parsed,
    input,
    setInput,
    isValid,
    isAmbiguous,
    reset,
  };
}

// ---------------------------------------------------------------------------
// Interview Notes
// ---------------------------------------------------------------------------

/**
 * KEY INSIGHTS FOR INTERVIEWS:
 *
 * 1. JavaScript's Date constructor silently rolls over:
 *    new Date(2025, 1, 30) → March 2, 2025
 *    This is the #1 source of date bugs in JavaScript.
 *
 * 2. Always validate by constructing the date AND checking that the
 *    components match what you expected.
 *
 * 3. For ambiguous formats (03/04/2025), the best approach is to:
 *    a) Detect the ambiguity
 *    b) Show the user a format selector
 *    c) Remember their preference for future inputs
 *
 * 4. ISO 8601 format (YYYY-MM-DD) is unambiguous and should be the
 *    default for APIs and data exchange.
 *
 * 5. For production date handling, consider libraries:
 *    - date-fns (lightweight, tree-shakeable)
 *    - luxon (immutable, timezone support)
 *    - dayjs (Moment-compatible API, small bundle)
 *
 * 6. Server-side validation is mandatory — client-side parsing is
 *    for UX only. Never trust client-side date validation alone.
 */
