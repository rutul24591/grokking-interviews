// Core TypeScript interfaces for the payment/checkout system

export type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export type PaymentStatus =
  | "idle"
  | "validating"
  | "processing"
  | "three-ds-required"
  | "success"
  | "failed"
  | "abandoned";

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  detectedType: CardType;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderSummary {
  items: LineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface PaymentError {
  code: string;
  message: string;
  retryable: boolean;
  field?: string;
}

export interface CardValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ExpiryValidationResult {
  isValid: boolean;
  error?: string;
  month?: number;
  year?: number;
}

export interface CVVValidationResult {
  isValid: boolean;
  error?: string;
  expectedLength: number;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "requires_confirmation" | "requires_action" | "succeeded" | "canceled";
}

export interface ThreeDSecureResult {
  status: "completed" | "failed" | "abandoned";
  error?: string;
}

export interface PaymentConfirmationResult {
  status: "success" | "failed";
  transactionId?: string;
  error?: PaymentError;
}
