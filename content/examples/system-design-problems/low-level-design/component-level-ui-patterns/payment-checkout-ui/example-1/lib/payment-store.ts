import { create } from "zustand";
import type {
  CardData,
  Address,
  OrderSummary,
  PaymentStatus,
  PaymentError,
  CardType,
} from "./payment-types";

interface ValidationErrors {
  [field: string]: string | undefined;
}

interface PaymentState {
  // Card data
  card: CardData;
  billingAddress: Address;
  shippingAddress: Address;
  sameAsBilling: boolean;

  // Order
  orderSummary: OrderSummary | null;

  // Payment flow
  paymentStatus: PaymentStatus;
  validationErrors: ValidationErrors;
  paymentError: PaymentError | null;
  paymentIntentId: string | null;
  retryCount: number;

  // Actions
  updateCardField: (field: keyof CardData, value: string) => void;
  updateAddressField: (
    type: "billing" | "shipping",
    field: keyof Address,
    value: string
  ) => void;
  toggleSameAsBilling: (enabled: boolean) => void;
  setValidationErrors: (errors: ValidationErrors) => void;
  clearFieldError: (field: string) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentError: (error: PaymentError | null) => void;
  setPaymentIntentId: (id: string | null) => void;
  setOrderSummary: (summary: OrderSummary) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  resetForm: () => void;
}

const defaultAddress: Address = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const defaultCard: CardData = {
  number: "",
  expiry: "",
  cvv: "",
  name: "",
  detectedType: "unknown",
};

const defaultOrderSummary: OrderSummary = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  currency: "USD",
};

export const usePaymentStore = create<PaymentState>((set) => ({
  // Initial state
  card: { ...defaultCard },
  billingAddress: { ...defaultAddress },
  shippingAddress: { ...defaultAddress },
  sameAsBilling: false,
  orderSummary: null,
  paymentStatus: "idle",
  validationErrors: {},
  paymentError: null,
  paymentIntentId: null,
  retryCount: 0,

  // Actions
  updateCardField: (field, value) =>
    set((state) => ({
      card: { ...state.card, [field]: value },
    })),

  updateAddressField: (type, field, value) =>
    set((state) => {
      const addressKey =
        type === "billing" ? "billingAddress" : "shippingAddress";
      return {
        [addressKey]: { ...state[addressKey], [field]: value },
      };
    }),

  toggleSameAsBilling: (enabled) =>
    set((state) => {
      if (enabled) {
        return {
          sameAsBilling: true,
          shippingAddress: { ...state.billingAddress },
        };
      }
      return { sameAsBilling: false };
    }),

  setValidationErrors: (errors) =>
    set(() => ({
      validationErrors: errors,
    })),

  clearFieldError: (field) =>
    set((state) => {
      const newErrors = { ...state.validationErrors };
      delete newErrors[field];
      return { validationErrors: newErrors };
    }),

  setPaymentStatus: (status) =>
    set(() => ({
      paymentStatus: status,
    })),

  setPaymentError: (error) =>
    set(() => ({
      paymentError: error,
    })),

  setPaymentIntentId: (id) =>
    set(() => ({
      paymentIntentId: id,
    })),

  setOrderSummary: (summary) =>
    set(() => ({
      orderSummary: summary,
    })),

  incrementRetryCount: () =>
    set((state) => ({
      retryCount: state.retryCount + 1,
    })),

  resetRetryCount: () =>
    set(() => ({
      retryCount: 0,
    })),

  resetForm: () =>
    set(() => ({
      card: { ...defaultCard },
      billingAddress: { ...defaultAddress },
      shippingAddress: { ...defaultAddress },
      sameAsBilling: false,
      paymentStatus: "idle",
      validationErrors: {},
      paymentError: null,
      paymentIntentId: null,
      retryCount: 0,
    })),
}));

// Selectors for use in components
export const selectCard = (state: PaymentState) => state.card;
export const selectBillingAddress = (state: PaymentState) => state.billingAddress;
export const selectShippingAddress = (state: PaymentState) => state.shippingAddress;
export const selectSameAsBilling = (state: PaymentState) => state.sameAsBilling;
export const selectOrderSummary = (state: PaymentState) => state.orderSummary;
export const selectPaymentStatus = (state: PaymentState) => state.paymentStatus;
export const selectValidationErrors = (state: PaymentState) => state.validationErrors;
export const selectPaymentError = (state: PaymentState) => state.paymentError;
export const selectPaymentIntentId = (state: PaymentState) => state.paymentIntentId;
export const selectRetryCount = (state: PaymentState) => state.retryCount;
