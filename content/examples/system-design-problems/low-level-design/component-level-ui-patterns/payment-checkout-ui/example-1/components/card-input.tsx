"use client";

import { useCardForm } from "../../hooks/use-card-form";
import type { CardType } from "../../lib/payment-types";

interface CardInputProps {
  onBlur?: () => void;
}

const cardIcons: Record<CardType, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  discover: "DISC",
  unknown: "",
};

export function CardInput({ onBlur }: CardInputProps) {
  const {
    formattedNumber,
    cardType,
    maxCardDigits,
    errors,
    updateNumber,
    validateNumber,
  } = useCardForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNumber(e.target.value);
  };

  const handleBlur = () => {
    validateNumber();
    onBlur?.();
  };

  const cardIcon = cardIcons[cardType];

  return (
    <div>
      <label
        htmlFor="card-number"
        className="mb-1.5 block text-sm font-medium"
      >
        Card Number
      </label>
      <div className="relative">
        <input
          id="card-number"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder={
            cardType === "amex"
              ? "3782 822463 10005"
              : "4242 4242 4242 4242"
          }
          value={formattedNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={
            cardType === "amex" ? 17 : 19
          }
          aria-invalid={errors.number ? "true" : "false"}
          aria-describedby={errors.number ? "card-number-error" : undefined}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-16 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        {cardIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-gray-100 px-2 py-0.5 text-xs font-bold dark:bg-gray-700">
            {cardIcon}
          </span>
        )}
      </div>
      {errors.number && (
        <p
          id="card-number-error"
          className="mt-1 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {errors.number}
        </p>
      )}
    </div>
  );
}
