import { CircuitBreaker } from "@/lib/circuitBreaker";
import { dependency } from "@/lib/dependencySim";
import { jsonOk } from "@/lib/http";
import { withRetries } from "@/lib/retry";

const breaker = new CircuitBreaker(3, 2_000);

async function callDependency() {
  const res = dependency.call();
  if (!res.ok) throw new Error("dep_failed");
  return res.value;
}

export async function GET() {
  const before = breaker.snapshot();

  try {
    const value = await breaker.exec(() => withRetries(() => callDependency(), 1));
    return jsonOk({ ok: true, value, breaker: breaker.snapshot(), before });
  } catch (e) {
    const after = breaker.snapshot();
    const open = String((e as Error).message) === "breaker_open";
    return jsonOk({
      ok: true,
      degraded: true,
      fallback: "served_fallback",
      reason: open ? "breaker_open" : "dependency_failure",
      breaker: after,
      before
    });
  }
}

