export type NetErrorKind = "dns" | "timeout" | "offline" | "http" | "unknown";
export type NetError = { kind: NetErrorKind; message: string; retryable: boolean; status?: number };

export function classify(e: unknown): NetError {
  if (e instanceof Error) {
    const m = e.message.toLowerCase();
    if (m.includes("offline")) return { kind: "offline", message: e.message, retryable: true };
    if (m.includes("timeout")) return { kind: "timeout", message: e.message, retryable: true };
    return { kind: "unknown", message: e.message, retryable: false };
  }
  return { kind: "unknown", message: "Unknown error", retryable: false };
}
