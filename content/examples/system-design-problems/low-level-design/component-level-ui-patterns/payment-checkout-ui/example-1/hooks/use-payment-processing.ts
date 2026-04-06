import { useCallback, useRef } from "react";
import { usePaymentStore } from "../lib/payment-store";
import {
  createPaymentIntent,
  tokenizeCard,
  confirmPayment,
  handle3DSecure,
  confirmAfter3DSecure,
  mapPaymentError,
} from "../api/payment-api";
import type { PaymentError } from "../lib/payment-types";

const MAX_RETRIES = 3;

interface UsePaymentProcessingReturn {
  submitPayment: () => Promise<void>;
  retryPayment: () => Promise<void>;
  isProcessing: boolean;
  isRetryable: boolean;
}

export function usePaymentProcessing(): UsePaymentProcessingReturn {
  const storeState = usePaymentStore();
  const {
    card,
    orderSummary,
    paymentStatus,
    paymentIntentId,
    retryCount,
    setPaymentStatus,
    setPaymentError,
    setPaymentIntentId,
    incrementRetryCount,
    resetRetryCount,
  } = storeState;

  const isSubmittingRef = useRef(false);

  const submitPayment = useCallback(async () => {
    if (isSubmittingRef.current) return;
    if (paymentStatus === "processing" || paymentStatus === "three-ds-required") return;

    isSubmittingRef.current = true;
    resetRetryCount();

    try {
      // Validate we have an order total
      if (!orderSummary) {
        setPaymentError({
          code: "no_order",
          message: "No order summary found. Please refresh the page.",
          retryable: false,
        });
        return;
      }

      setPaymentStatus("processing");
      setPaymentError(null);

      // Step 1: Create payment intent
      const intent = await createPaymentIntent(
        Math.round(orderSummary.total * 100), // convert to cents
        orderSummary.currency
      );
      setPaymentIntentId(intent.id);

      // Step 2: Tokenize card (raw card data goes directly to gateway)
      const token = await tokenizeCard(card);

      // Step 3: Confirm payment
      const result = await confirmPayment(intent.clientSecret, token);

      if (result.status === "failed" && result.error?.code === "requires_action") {
        // Step 4: Handle 3D Secure challenge
        setPaymentStatus("three-ds-required");
        const threeDSResult = await handle3DSecure(intent.clientSecret);

        if (threeDSResult.status === "abandoned") {
          setPaymentStatus("abandoned");
          setPaymentError(null);
          return;
        }

        if (threeDSResult.status === "failed") {
          setPaymentStatus("failed");
          setPaymentError({
            code: "three_ds_failed",
            message: "Authentication failed. Please try again.",
            retryable: true,
          });
          return;
        }

        // Step 5: Confirm payment after 3DS
        const finalResult = await confirmAfter3DSecure(intent.clientSecret);
        handlePaymentResult(finalResult);
        return;
      }

      handlePaymentResult(result);
    } catch (err) {
      const error = err as Error;
      setPaymentStatus("failed");
      setPaymentError(
        mapPaymentError(error.message.includes("network") ? "network_error" : "processing_error")
      );
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    card,
    orderSummary,
    paymentStatus,
    setPaymentStatus,
    setPaymentError,
    setPaymentIntentId,
    resetRetryCount,
  ]);

  const retryPayment = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      setPaymentError({
        code: "max_retries",
        message:
          "Maximum retry attempts reached. Please check your payment method and try again.",
        retryable: false,
      });
      return;
    }

    incrementRetryCount();
    setPaymentStatus("processing");
    setPaymentError(null);

    try {
      // Reuse the existing payment intent if available
      if (paymentIntentId) {
        // In production, we would re-confirm with the same intent
        // For now, we re-run the full flow
        await submitPayment();
        return;
      }

      // No existing intent — start fresh
      await submitPayment();
    } catch (err) {
      const error = err as Error;
      setPaymentStatus("failed");
      setPaymentError(
        mapPaymentError(error.message.includes("network") ? "network_error" : "processing_error")
      );
    }
  }, [
    retryCount,
    paymentIntentId,
    incrementRetryCount,
    setPaymentStatus,
    setPaymentError,
    submitPayment,
  ]);

  const isProcessing =
    paymentStatus === "processing" || paymentStatus === "three-ds-required";

  const isRetryable =
    paymentStatus === "failed" &&
    (storeState.paymentError?.retryable ?? false) &&
    retryCount < MAX_RETRIES;

  return {
    submitPayment,
    retryPayment,
    isProcessing,
    isRetryable,
  };
}

function handlePaymentResult(result: {
  status: "success" | "failed";
  transactionId?: string;
  error?: PaymentError;
}) {
  const store = usePaymentStore.getState();

  if (result.status === "success") {
    store.setPaymentStatus("success");
    store.setPaymentError(null);
  } else {
    store.setPaymentStatus("failed");
    store.setPaymentError(
      result.error ?? {
        code: "unknown",
        message: "Payment failed. Please try again.",
        retryable: true,
      }
    );
  }
}
