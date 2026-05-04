import React, { useMemo } from "react";
import { useStore } from "zustand";
import type { StepGraph } from "../lib/step-definition";
import { createWizardStore } from "../lib/wizard-store";

type Values = {
  email: string;
  address: string;
  wantsInvoice: boolean;
  taxId: string;
};

const graph: StepGraph<Values> = {
  start: "account",
  steps: {
    account: {
      id: "account",
      title: "Account",
      validate: (v) => ({
        email: String(v.email ?? "").includes("@") ? [] : ["Enter a valid email."],
      }),
      next: () => "shipping",
    },
    shipping: {
      id: "shipping",
      title: "Shipping",
      validate: (v) => ({
        address: String(v.address ?? "").trim() ? [] : ["Address is required."],
      }),
      prev: () => "account",
      next: (v) => (v.wantsInvoice ? "invoice" : "review"),
    },
    invoice: {
      id: "invoice",
      title: "Invoice",
      validate: (v) => ({
        taxId: String(v.taxId ?? "").trim() ? [] : ["Tax ID required for invoice."],
      }),
      prev: () => "shipping",
      next: () => "review",
    },
    review: {
      id: "review",
      title: "Review",
      prev: (v) => (v.wantsInvoice ? "invoice" : "shipping"),
      next: () => null,
    },
  },
};

export function WizardExample() {
  const store = useMemo(
    () =>
      createWizardStore<Values>({
        graph,
        initialValues: { email: "", address: "", wantsInvoice: false, taxId: "" },
      }),
    [],
  );

  const stepId = useStore(store, (s) => s.currentStep);
  const values = useStore(store, (s) => s.values);
  const errors = useStore(store, (s) => s.stepErrors[stepId] ?? {});
  const submitting = useStore(store, (s) => s.submitting);

  const step = graph.steps[stepId];

  return (
    <section aria-label="Wizard example">
      <h3>{step.title}</h3>

      {stepId === "account" ? (
        <label>
          Email
          <input
            value={values.email}
            onChange={(e) => store.getState().setValue("email", e.target.value)}
            aria-invalid={!!errors.email?.length}
          />
        </label>
      ) : null}

      {stepId === "shipping" ? (
        <>
          <label>
            Address
            <input
              value={values.address}
              onChange={(e) => store.getState().setValue("address", e.target.value)}
              aria-invalid={!!errors.address?.length}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={values.wantsInvoice}
              onChange={(e) => store.getState().setValue("wantsInvoice", e.target.checked)}
            />
            Request invoice
          </label>
        </>
      ) : null}

      {stepId === "invoice" ? (
        <label>
          Tax ID
          <input
            value={values.taxId}
            onChange={(e) => store.getState().setValue("taxId", e.target.value)}
            aria-invalid={!!errors.taxId?.length}
          />
        </label>
      ) : null}

      <div role="alert">
        {Object.values(errors)
          .flat()
          .map((m) => (
            <div key={m}>{m}</div>
          ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() => store.getState().goPrev()}>
          Back
        </button>
        <button type="button" onClick={() => store.getState().goNext()}>
          Next
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => store.getState().submit(async () => {})}
        >
          Submit
        </button>
      </div>
    </section>
  );
}

