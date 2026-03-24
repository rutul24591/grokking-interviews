import { closeBreaker, openBreaker, readBreakerState } from "@/lib/circuitBreaker";

export type FailoverResult = {
  chosen: "primary" | "secondary";
  url: string;
  status: number;
  bytes: number;
};

async function tryFetch(url: string): Promise<{ status: number; bytes: number }> {
  const res = await fetch(url, { cache: "no-store" });
  const buf = res.ok ? await res.arrayBuffer() : new ArrayBuffer(0);
  return { status: res.status, bytes: buf.byteLength };
}

export async function fetchWithCdnFailover(params: {
  primary: string;
  secondary: string;
  path: string;
  breakerOpenMs?: number;
}): Promise<FailoverResult> {
  const breaker = readBreakerState();
  const open = breaker.openUntilMs > Date.now();
  const breakerMs = params.breakerOpenMs ?? 15_000;

  const primaryUrl = `${params.primary}${params.path}`;
  const secondaryUrl = `${params.secondary}${params.path}`;

  if (!open) {
    try {
      const r = await tryFetch(primaryUrl);
      if (r.status >= 200 && r.status < 500) {
        closeBreaker();
        return { chosen: "primary", url: primaryUrl, ...r };
      }
      openBreaker(breakerMs);
    } catch {
      openBreaker(breakerMs);
    }
  }

  const r2 = await tryFetch(secondaryUrl);
  return { chosen: "secondary", url: secondaryUrl, ...r2 };
}

