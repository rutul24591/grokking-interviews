export const verification = {
  email: "owner@example.com",
  status: "pending" as "pending" | "verified",
  token: "VERIFY-7890",
  expiresAt: Date.now() + 15 * 60 * 1000,
  resendAvailableAt: Date.now(),
  lastMessage: "Verification pending.",
};

export function view() {
  const now = Date.now();
  return {
    ...verification,
    expired: now > verification.expiresAt,
    resendSeconds: Math.max(0, Math.ceil((verification.resendAvailableAt - now) / 1000)),
  };
}
