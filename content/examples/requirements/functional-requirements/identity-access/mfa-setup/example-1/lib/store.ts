export type MfaState = {
  setupStarted: boolean;
  enrolled: boolean;
  secret: string;
  challengeCode: string;
  backupCodesRemaining: number;
  trustedDeviceEnabled: boolean;
  attemptsRemaining: number;
  enrollmentStage: "idle" | "qr-issued" | "verified";
  lastMessage: string;
};

export const mfa: MfaState = {
  setupStarted: false,
  enrolled: false,
  secret: "TOTP-SEED-9471",
  challengeCode: "258147",
  backupCodesRemaining: 8,
  trustedDeviceEnabled: false,
  attemptsRemaining: 3,
  enrollmentStage: "idle",
  lastMessage: "MFA not configured."
};
