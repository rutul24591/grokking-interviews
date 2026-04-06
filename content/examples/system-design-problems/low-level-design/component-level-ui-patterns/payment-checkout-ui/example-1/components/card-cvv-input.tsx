"use client";

import { useCardForm } from "../../hooks/use-card-form";

interface CardCVVInputProps {
  onBlur?: () => void;
}

export function CardCVVInput({ onBlur }: CardCVVInputProps) {
  const { formattedCVV, cvvLength, cardType, errors, updateCVV, validateCVVField } =
    useCardForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCVV(e.target.value);
  };

  const handleBlur = () => {
    validateCVVField();
    onBlur?.();
  };

  const hint = cardType === "amex" ? "4 digits" : "3 digits";

  return (
    <div>
      <label
        htmlFor="card-cvv"
        className="mb-1.5 block text-sm font-medium"
      >
        CVV
      </label>
      <input
        id="card-cvv"
        type="password"
        inputMode="numeric"
        autoComplete="cc-csc"
        placeholder={hint}
        value={formattedCVV}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={cvvLength}
        aria-invalid={errors.cvv ? "true" : "false"}
        aria-describedby={errors.cvv ? "card-cvv-error" : undefined}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
      {errors.cvv && (
        <p
          id="card-cvv-error"
          className="mt-1 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {errors.cvv}
        </p>
      )}
    </div>
  );
}
