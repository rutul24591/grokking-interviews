import fetch from "node-fetch";
import { CircuitBreaker } from "./breaker.js";

const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 5000 });

export async function chargeCard(amount) {
  if (!breaker.canRequest()) {
    return { ok: false, error: "payment_unavailable" };
  }

  try {
    const res = await fetch("http://localhost:4201/charge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (res.status >= 500) {
      breaker.failure();
      return { ok: false, error: "processor_error" };
    }
    breaker.success();
    return { ok: true };
  } catch (err) {
    breaker.failure();
    return { ok: false, error: "network_error" };
  }
}