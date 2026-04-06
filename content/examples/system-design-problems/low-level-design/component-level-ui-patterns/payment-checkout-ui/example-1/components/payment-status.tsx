"use client";

import {
  usePaymentStore,
  selectPaymentStatus,
  selectPaymentError,
  selectPaymentIntentId,
} from "../../lib/payment-store";
import { usePaymentProcessing } from "../../hooks/use-payment-processing";

export function PaymentStatus() {
  const status = usePaymentStore(selectPaymentStatus);
  const error = usePaymentStore(selectPaymentError);
  const intentId = usePaymentStore(selectPaymentIntentId);
  const { retryPayment, isProcessing } = usePaymentProcessing();

  if (status === "idle" || status === "validating") {
    return null;
  }

  if (status === "processing") {
    return (
      <div
        className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-800 dark:bg-blue-900/20"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-700 dark:border-t-blue-400" />
        <p className="font-medium text-blue-900 dark:text-blue-100">
          Processing payment...
        </p>
        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
          Please do not close this page.
        </p>
      </div>
    );
  }

  if (status === "three-ds-required") {
    return (
      <div
        className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-800 dark:bg-yellow-900/20"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-600 dark:border-yellow-700 dark:border-t-yellow-400" />
        <p className="font-medium text-yellow-900 dark:text-yellow-100">
          Bank verification required
        </p>
        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
          Redirecting to your bank for secure authentication...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-center text-lg font-semibold text-green-900 dark:text-green-100">
          Payment Successful
        </h3>
        <p className="mt-2 text-center text-sm text-green-700 dark:text-green-300">
          Your payment has been processed successfully.
        </p>
        {intentId && (
          <p className="mt-2 text-center text-xs text-green-600 dark:text-green-400">
            Transaction ID: {intentId}
          </p>
        )}
        <p className="mt-4 text-center text-sm text-green-700 dark:text-green-300">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20"
        role="alert"
        aria-live="assertive"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-center text-lg font-semibold text-red-900 dark:text-red-100">
          Payment Failed
        </h3>
        <p className="mt-2 text-center text-sm text-red-700 dark:text-red-300">
          {error.message}
        </p>
        {error.retryable && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={retryPayment}
              disabled={isProcessing}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
            >
              {isProcessing ? "Retrying..." : "Try Again"}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === "abandoned") {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          <svg
            className="h-6 w-6 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
          Payment Not Completed
        </h3>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          The verification step was not completed. You can try again when ready.
        </p>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={retryPayment}
            disabled={isProcessing}
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-offset-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
