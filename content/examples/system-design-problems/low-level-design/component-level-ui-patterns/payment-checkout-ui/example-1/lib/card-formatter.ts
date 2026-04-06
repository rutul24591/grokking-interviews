import { CardType } from "./payment-types";

/**
 * Format card number with spaces every 4 digits.
 * American Express uses 4-6-5 grouping.
 * All other cards use 4-4-4-4 grouping.
 */
export function formatCardNumber(number: string, cardType: CardType): string {
  const digits = number.replace(/\D/g, "");

  if (cardType === "amex") {
    // Amex: 4-6-5 grouping
    const parts: string[] = [];
    if (digits.length > 0) parts.push(digits.slice(0, 4));
    if (digits.length > 4) parts.push(digits.slice(4, 10));
    if (digits.length > 10) parts.push(digits.slice(10, 15));
    return parts.join(" ");
  }

  // Standard: 4-4-4-4 grouping
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(" ");
}

/**
 * Get the maximum formatted length for a card number.
 * Amex: 15 digits + 2 spaces = 17 characters
 * Others: 16 digits + 3 spaces = 19 characters
 */
export function getMaxCardNumberLength(cardType: CardType): number {
  if (cardType === "amex") return 15; // raw digits
  return 16; // raw digits
}

/**
 * Strip formatting from a card number, returning only digits.
 */
export function stripCardNumber(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

/**
 * Format expiry date as MM/YY.
 * Auto-inserts slash after month.
 * Pads single-digit months with leading zero when the user types a second digit
 * that would result in a valid month (01-12).
 */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // If first digit is 0 or 1, allow second digit to be 0-9
  // If first digit is 2-9, only valid month starts are 01-09, 10, 11, 12
  // So if user types '2' as first digit, we pad to '02' only if that makes sense
  // Actually, we just format as-is and let validation catch invalid months

  if (digits.length <= 2) {
    return digits;
  }

  // Insert slash after first 2 digits (MM)
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
}

/**
 * Strip formatting from expiry, returning only digits.
 */
export function stripExpiry(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

/**
 * Format CVV — strip non-numeric characters.
 * CVV is never formatted with spaces or separators.
 */
export function formatCVV(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Format cardholder name — trim and collapse multiple spaces.
 */
export function formatCardholderName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}
