export type ApiError = {
  kind: "network" | "timeout" | "http" | "auth" | "validation" | "unknown";
  message: string;
  status?: number;
  retryable: boolean;
};

export function normalizeError(e: unknown): ApiError {
  if (e instanceof Error) {
    if (/timeout/i.test(e.message)) return { kind: "timeout", message: e.message, retryable: true };
    return { kind: "unknown", message: e.message, retryable: false };
  }
  return { kind: "unknown", message: "Unknown error", retryable: false };
}
