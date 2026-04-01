export const recovery = {
  email: "owner@example.com",
  requestAccepted: false,
  token: "RECOVER-123456",
  tokenExpiresAt: Date.now() + 10 * 60 * 1000,
  passwordUpdated: false,
  lastMessage: "No recovery request started.",
};

export function state() {
  return {
    ...recovery,
    tokenExpired: Date.now() > recovery.tokenExpiresAt,
  };
}
