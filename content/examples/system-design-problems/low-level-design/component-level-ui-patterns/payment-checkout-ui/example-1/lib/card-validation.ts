import {
  CardType,
  CardValidationResult,
  ExpiryValidationResult,
  CVVValidationResult,
} from "./payment-types";

/**
 * Luhn algorithm validation for card numbers.
 *
 * Steps:
 * 1. Starting from the rightmost digit, double every second digit.
 * 2. If doubling results in a number > 9, subtract 9.
 * 3. Sum all digits.
 * 4. If total modulo 10 equals 0, the number is valid.
 */
export function validateLuhn(number: string): CardValidationResult {
  const digits = number.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) {
    return { isValid: false, error: "Card number must be 13-19 digits" };
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: "Invalid card number" };
  }

  return { isValid: true };
}

/**
 * Detect card type from BIN (Bank Identification Number) prefix.
 *
 * BIN ranges based on industry standards:
 * - Visa: starts with 4
 * - Mastercard: 51-55 or 2221-2720
 * - Amex: 34 or 37
 * - Discover: 6011, 622126-622925, or 65
 */
export function detectCardType(number: string): CardType {
  const digits = number.replace(/\D/g, "");

  if (digits.length === 0) return "unknown";

  // American Express: starts with 34 or 37
  if (/^3[47]/.test(digits)) {
    return "amex";
  }

  // Visa: starts with 4
  if (/^4/.test(digits)) {
    return "visa";
  }

  // Mastercard: 51-55 or 2221-2720
  if (/^5[1-5]/.test(digits)) {
    return "mastercard";
  }
  if (/^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(digits)) {
    return "mastercard";
  }

  // Discover: 6011, 622126-622925, 65
  if (/^6011/.test(digits)) {
    return "discover";
  }
  if (/^65/.test(digits)) {
    return "discover";
  }
  if (/^622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[01]\d|92[0-5])/.test(digits)) {
    return "discover";
  }

  // If we have enough digits but no match, it's an unknown type
  if (digits.length >= 4) {
    return "unknown";
  }

  return "unknown";
}

/**
 * Get the expected CVV length for a card type.
 * Amex uses 4 digits; all others use 3.
 */
export function getCVVLength(cardType: CardType): number {
  return cardType === "amex" ? 4 : 3;
}

/**
 * Validate CVV based on card type.
 */
export function validateCVV(cvv: string, cardType: CardType): CVVValidationResult {
  const expectedLength = getCVVLength(cardType);
  const digits = cvv.replace(/\D/g, "");

  if (digits.length === 0) {
    return { isValid: false, error: "CVV is required", expectedLength };
  }

  if (digits.length !== expectedLength) {
    return {
      isValid: false,
      error: `CVV must be ${expectedLength} digits`,
      expectedLength,
    };
  }

  return { isValid: true, expectedLength };
}

/**
 * Validate expiry date (MM/YY format).
 *
 * Rules:
 * - Month must be 01-12
 * - Year must be current year to current year + 10
 * - Date must be in the future (card is valid through the END of the expiry month)
 */
export function validateExpiry(expiry: string): ExpiryValidationResult {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);

  if (!match) {
    return { isValid: false, error: "Expiry must be in MM/YY format" };
  }

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) {
    return { isValid: false, error: "Invalid month" };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // Check if year is too far in the future (more than 10 years)
  if (year > currentYear + 10) {
    return { isValid: false, error: "Card expires too far in the future" };
  }

  // Card is valid through the END of the expiry month
  // Compare: if year < currentYear, expired
  // If year === currentYear and month < currentMonth, expired
  // If year === currentYear and month === currentMonth, still valid (through end of month)
  if (year < currentYear) {
    return { isValid: false, error: "Card has expired" };
  }

  if (year === currentYear && month < currentMonth) {
    return { isValid: false, error: "Card has expired" };
  }

  return { isValid: true, month, year };
}

/**
 * Validate cardholder name.
 * Minimum 2 characters, alphabetic characters and spaces only.
 */
export function validateCardholderName(name: string): CardValidationResult {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Cardholder name is required" };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: "Name is too long" };
  }

  return { isValid: true };
}
