import { useCallback } from "react";
import { usePaymentStore, selectCard, selectValidationErrors } from "../lib/payment-store";
import {
  detectCardType,
  validateLuhn,
  validateExpiry,
  validateCVV,
  validateCardholderName,
  getCVVLength,
} from "../lib/card-validation";
import {
  formatCardNumber,
  formatExpiry,
  formatCVV,
  formatCardholderName,
  stripCardNumber,
  stripExpiry,
  getMaxCardNumberLength,
} from "../lib/card-formatter";
import type { CardType } from "../lib/payment-types";

interface UseCardFormReturn {
  // Formatted values for display
  formattedNumber: string;
  formattedExpiry: string;
  formattedCVV: string;
  formattedName: string;

  // Card type detection
  cardType: CardType;
  cvvLength: number;
  maxCardDigits: number;

  // Validation errors
  errors: {
    number?: string;
    expiry?: string;
    cvv?: string;
    name?: string;
  };

  // Actions
  updateNumber: (value: string) => void;
  updateExpiry: (value: string) => void;
  updateCVV: (value: string) => void;
  updateName: (value: string) => void;

  // Validation triggers
  validateNumber: () => void;
  validateExpiryField: () => void;
  validateCVVField: () => void;
  validateNameField: () => void;

  // Overall validity
  isFormValid: boolean;
}

export function useCardForm(): UseCardFormReturn {
  const card = usePaymentStore(selectCard);
  const validationErrors = usePaymentStore(selectValidationErrors);
  const updateCardField = usePaymentStore((s) => s.updateCardField);
  const setValidationErrors = usePaymentStore((s) => s.setValidationErrors);
  const clearFieldError = usePaymentStore((s) => s.clearFieldError);

  // Detect card type from current number
  const cardType = detectCardType(card.number);
  const cvvLength = getCVVLength(cardType);
  const maxCardDigits = getMaxCardNumberLength(cardType);

  // Format values for display
  const formattedNumber = formatCardNumber(card.number, cardType);
  const formattedExpiry = formatExpiry(card.expiry);
  const formattedCVV = formatCVV(card.cvv);
  const formattedName = formatCardholderName(card.name);

  // Errors from store
  const errors = {
    number: validationErrors["card.number"],
    expiry: validationErrors["card.expiry"],
    cvv: validationErrors["card.cvv"],
    name: validationErrors["card.name"],
  };

  const updateNumber = useCallback(
    (value: string) => {
      const digits = stripCardNumber(value);
      if (digits.length > maxCardDigits) return;
      updateCardField("number", digits);
      clearFieldError("card.number");

      // Update detected type
      const detected = detectCardType(digits);
      if (detected !== cardType) {
        updateCardField("detectedType", detected);
      }
    },
    [maxCardDigits, updateCardField, clearFieldError, cardType]
  );

  const updateExpiry = useCallback(
    (value: string) => {
      const digits = stripExpiry(value);
      if (digits.length > 4) return;
      updateCardField("expiry", digits);
      clearFieldError("card.expiry");
    },
    [updateCardField, clearFieldError]
  );

  const updateCVV = useCallback(
    (value: string) => {
      const digits = formatCVV(value);
      if (digits.length > cvvLength) return;
      updateCardField("cvv", digits);
      clearFieldError("card.cvv");
    },
    [cvvLength, updateCardField, clearFieldError]
  );

  const updateName = useCallback(
    (value: string) => {
      updateCardField("name", value);
      clearFieldError("card.name");
    },
    [updateCardField, clearFieldError]
  );

  const validateNumber = useCallback(() => {
    const digits = stripCardNumber(card.number);
    if (digits.length === 0) {
      setValidationErrors({ "card.number": "Card number is required" });
      return false;
    }
    const result = validateLuhn(digits);
    if (!result.isValid) {
      setValidationErrors({ "card.number": result.error });
      return false;
    }
    clearFieldError("card.number");
    return true;
  }, [card.number, setValidationErrors, clearFieldError]);

  const validateExpiryField = useCallback(() => {
    if (card.expiry.length === 0) {
      setValidationErrors({ "card.expiry": "Expiry date is required" });
      return false;
    }
    const result = validateExpiry(formatExpiry(card.expiry));
    if (!result.isValid) {
      setValidationErrors({ "card.expiry": result.error });
      return false;
    }
    clearFieldError("card.expiry");
    return true;
  }, [card.expiry, setValidationErrors, clearFieldError]);

  const validateCVVField = useCallback(() => {
    const result = validateCVV(card.cvv, cardType);
    if (!result.isValid) {
      setValidationErrors({ "card.cvv": result.error });
      return false;
    }
    clearFieldError("card.cvv");
    return true;
  }, [card.cvv, cardType, setValidationErrors, clearFieldError]);

  const validateNameField = useCallback(() => {
    const result = validateCardholderName(card.name);
    if (!result.isValid) {
      setValidationErrors({ "card.name": result.error });
      return false;
    }
    clearFieldError("card.name");
    return true;
  }, [card.name, setValidationErrors, clearFieldError]);

  const isFormValid =
    stripCardNumber(card.number).length > 0 &&
    card.expiry.length > 0 &&
    card.cvv.length > 0 &&
    card.name.trim().length > 0 &&
    !errors.number &&
    !errors.expiry &&
    !errors.cvv &&
    !errors.name;

  return {
    formattedNumber,
    formattedExpiry,
    formattedCVV,
    formattedName,
    cardType,
    cvvLength,
    maxCardDigits,
    errors,
    updateNumber,
    updateExpiry,
    updateCVV,
    updateName,
    validateNumber,
    validateExpiryField,
    validateCVVField,
    validateNameField,
    isFormValid,
  };
}
