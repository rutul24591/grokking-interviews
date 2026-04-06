"use client";

import { usePaymentStore, selectOrderSummary } from "../../lib/payment-store";

export function OrderSummary() {
  const order = usePaymentStore(selectOrderSummary);

  if (!order) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No order summary available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

      {/* Line Items */}
      <div className="mb-4 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500 dark:text-gray-400">
                Qty: {item.quantity} x {formatCurrency(item.unitPrice, order.currency)}
              </p>
            </div>
            <p className="font-medium">
              {formatCurrency(item.quantity * item.unitPrice, order.currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
        {/* Subtotal */}
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span>{formatCurrency(order.subtotal, order.currency)}</span>
        </div>

        {/* Discount */}
        {order.discount > 0 && (
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Discount</span>
            <span className="text-green-600 dark:text-green-400">
              -{formatCurrency(order.discount, order.currency)}
            </span>
          </div>
        )}

        {/* Tax */}
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax</span>
          <span>{formatCurrency(order.tax, order.currency)}</span>
        </div>

        {/* Shipping */}
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span>
            {order.shipping === 0
              ? "Free"
              : formatCurrency(order.shipping, order.currency)}
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
