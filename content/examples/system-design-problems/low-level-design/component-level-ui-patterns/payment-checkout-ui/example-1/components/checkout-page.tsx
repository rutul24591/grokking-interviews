"use client";

import { useCallback } from "react";
import { useCardForm } from "../../hooks/use-card-form";
import { usePaymentProcessing } from "../../hooks/use-payment-processing";
import { usePaymentStore, selectPaymentStatus } from "../../lib/payment-store";
import { CardInput } from "./card-input";
import { CardExpiryInput } from "./card-expiry-input";
import { CardCVVInput } from "./card-cvv-input";
import { AddressForm } from "./address-form";
import { OrderSummary } from "./order-summary";
import { PaymentStatus } from "./payment-status";

export function CheckoutPage() {
  const {
    formattedName,
    errors,
    updateName,
    validateNameField,
    isFormValid,
    validateNumber,
    validateExpiryField,
    validateCVVField,
  } = useCardForm();

  const { submitPayment, isProcessing } = usePaymentProcessing();
  const paymentStatus = usePaymentStore(selectPaymentStatus);

  const isSubmitting =
    isProcessing ||
    paymentStatus === "processing" ||
    paymentStatus === "three-ds-required";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Run all validations
      const validNumber = validateNumber();
      const validExpiry = validateExpiryField();
      const validCVV = validateCVVField();
      const validName = validateNameField();

      if (!validNumber || !validExpiry || !validCVV || !validName) {
        return;
      }

      submitPayment();
    },
    [
      validateNumber,
      validateExpiryField,
      validateCVVField,
      validateNameField,
      submitPayment,
    ]
  );

  // Disable form during processing
  const isFormDisabled =
    paymentStatus === "processing" || paymentStatus === "three-ds-required";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Payment Form - Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold">Payment Details</h2>

            <div className="space-y-4">
              <CardInput />

              <div className="grid grid-cols-2 gap-4">
                <CardExpiryInput />
                <CardCVVInput />
              </div>

              <div>
                <label
                  htmlFor="cardholder-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Cardholder Name
                </label>
                <input
                  id="cardholder-name"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Name as it appears on card"
                  value={formattedName}
                  onChange={(e) => updateName(e.target.value)}
                  onBlur={validateNameField}
                  disabled={isFormDisabled}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={
                    errors.name ? "cardholder-name-error" : undefined
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {errors.name && (
                  <p
                    id="cardholder-name-error"
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <AddressForm type="billing" />
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <AddressForm type="shipping" />
          </div>

          {/* Payment Status */}
          <PaymentStatus />

          {/* Submit Button */}
          {paymentStatus !== "success" && (
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>

        {/* Order Summary - Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <OrderSummary />
          </div>
        </div>
      </form>
    </div>
  );
}
