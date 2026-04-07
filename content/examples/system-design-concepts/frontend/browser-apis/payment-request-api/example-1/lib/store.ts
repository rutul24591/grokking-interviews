export const scenarios = [
  {
    "id": "wallet-ready",
    "label": "Wallet-ready checkout",
    "surface": "Express payment sheet",
    "status": "healthy",
    "signal": "Payment Request supported and wallet available",
    "budget": "Totals already stable",
    "fallback": "Standard checkout stays in reserve",
    "headline": "Browser-assisted checkout is acceptable when capability detection is positive and totals are already final.",
    "decision": "Offer the wallet path as an optimization while keeping standard checkout in reserve.",
    "tasks": [
      "Keep the standard checkout available.",
      "Preserve cart state on return.",
      "Show stable totals before handoff."
    ]
  },
  {
    "id": "shipping-change",
    "label": "Dynamic shipping update",
    "surface": "Address-dependent checkout",
    "status": "watch",
    "signal": "Shipping callbacks update totals",
    "budget": "Confirmation waits on tax recalculation",
    "fallback": "Fallback checkout still armed",
    "headline": "Dynamic totals make wallet handoff risky unless shipping and tax updates settle before confirmation.",
    "decision": "Pause confirmation until totals are final and fall back cleanly if the sheet cannot recover.",
    "tasks": [
      "Freeze confirmation during recalculation.",
      "Keep address-dependent changes visible.",
      "Return to standard checkout if the wallet path fails."
    ]
  },
  {
    "id": "unsupported",
    "label": "Unsupported checkout runtime",
    "surface": "Capability detection failed",
    "status": "repair",
    "signal": "Payment Request unavailable",
    "budget": "Hosted or custom fallback required",
    "fallback": "Standard card form remains primary",
    "headline": "Unsupported browsers still need a complete checkout path instead of a disabled pay button.",
    "decision": "Route directly to the standard checkout and stop advertising wallet-only flows.",
    "tasks": [
      "Hide unsupported payment sheet entry.",
      "Preserve cart and address state.",
      "Explain the fallback path clearly."
    ]
  }
] as const;

export const playbook = [
  "Treat Payment Request as an optimization, not the only checkout path.",
  "Do not allow confirmation until totals and shipping are final.",
  "Preserve cart state when falling back from the wallet sheet."
] as const;

export const recovery = [
  {
    "issue": "Unsupported runtime",
    "action": "Return to the standard checkout path immediately."
  },
  {
    "issue": "Totals unstable",
    "action": "Pause confirmation until tax and shipping settle."
  },
  {
    "issue": "Wallet handoff failure",
    "action": "Return to fallback checkout without losing cart state."
  }
] as const;
