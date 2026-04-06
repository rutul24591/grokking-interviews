"use client";

import { useCallback } from "react";
import {
  usePaymentStore,
  selectBillingAddress,
  selectShippingAddress,
  selectSameAsBilling,
} from "../../lib/payment-store";
import type { Address } from "../../lib/payment-types";

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
];

interface AddressFormProps {
  type: "billing" | "shipping";
}

export function AddressForm({ type }: AddressFormProps) {
  const billingAddress = usePaymentStore(selectBillingAddress);
  const shippingAddress = usePaymentStore(selectShippingAddress);
  const sameAsBilling = usePaymentStore(selectSameAsBilling);
  const updateAddressField = usePaymentStore((s) => s.updateAddressField);
  const toggleSameAsBilling = usePaymentStore((s) => s.toggleSameAsBilling);

  const address = type === "billing" ? billingAddress : shippingAddress;
  const isDisabled = type === "shipping" && sameAsBilling;

  const handleChange = useCallback(
    (field: keyof Address) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateAddressField(type, field, e.target.value);
      },
    [type, updateAddressField]
  );

  if (type === "shipping" && sameAsBilling) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Shipping address is the same as billing address.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {type === "billing" ? "Billing Address" : "Shipping Address"}
        </h3>
        {type === "shipping" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => toggleSameAsBilling(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-600 dark:text-gray-400">
              Same as billing
            </span>
          </label>
        )}
      </div>

      <div>
        <label
          htmlFor={`${type}-street`}
          className="mb-1.5 block text-sm font-medium"
        >
          Street Address
        </label>
        <input
          id={`${type}-street`}
          type="text"
          value={address.street}
          onChange={handleChange("street")}
          disabled={isDisabled}
          autoComplete={
            type === "billing" ? "billing street-address" : "shipping street-address"
          }
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${type}-city`}
            className="mb-1.5 block text-sm font-medium"
          >
            City
          </label>
          <input
            id={`${type}-city`}
            type="text"
            value={address.city}
            onChange={handleChange("city")}
            disabled={isDisabled}
            autoComplete={type === "billing" ? "billing address-level2" : "shipping address-level2"}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor={`${type}-state`}
            className="mb-1.5 block text-sm font-medium"
          >
            State
          </label>
          <input
            id={`${type}-state`}
            type="text"
            value={address.state}
            onChange={handleChange("state")}
            disabled={isDisabled}
            autoComplete={type === "billing" ? "billing address-level1" : "shipping address-level1"}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${type}-zip`}
            className="mb-1.5 block text-sm font-medium"
          >
            ZIP Code
          </label>
          <input
            id={`${type}-zip`}
            type="text"
            value={address.zip}
            onChange={handleChange("zip")}
            disabled={isDisabled}
            autoComplete={type === "billing" ? "billing postal-code" : "shipping postal-code"}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor={`${type}-country`}
            className="mb-1.5 block text-sm font-medium"
          >
            Country
          </label>
          <select
            id={`${type}-country`}
            value={address.country}
            onChange={handleChange("country")}
            disabled={isDisabled}
            autoComplete={type === "billing" ? "billing country" : "shipping country"}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
