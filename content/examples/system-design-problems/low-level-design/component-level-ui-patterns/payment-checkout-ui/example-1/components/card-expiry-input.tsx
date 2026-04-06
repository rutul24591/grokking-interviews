"use client";

import { useCardForm } from "../../hooks/use-card-form";

interface CardExpiryInputProps {
  onBlur?: () => void;
}

export function CardExpiryInput({ onBlur }: CardExpiryInputProps) {
  const { formattedExpiry, errors, updateExpiry, validateExpiryField } =
    useCardForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateExpiry(e.target.value);
  };

  const handleBlur = () => {
    validateExpiryField();
    onBlur?.();
  };

  return (
    <div>
      <label
        htmlFor="card-expiry"
        className="mb-1.5 block text-sm font-medium"
      >
        Expiry Date
      </label>
      <input
        id="card-expiry"
        type="text"
        inputMode="numeric"
        autoComplete="cc-exp"
        placeholder="MM/YY"
        value={formattedExpiry}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={5}
        aria-invalid={errors.expiry ? "true" : "false"}
        aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
      {errors.expiry && (
        <p
          id="card-expiry-error"
          className="mt-1 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {errors.expiry}
        </p>
      )}
    </div>
  );
}
