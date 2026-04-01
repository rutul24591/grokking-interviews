export type SecuritySettings = {
  mfaRequired: boolean;
  loginAlerts: boolean;
  trustedDevicesOnly: boolean;
  sessionTimeoutMinutes: number;
  saveCount: number;
  lastMessage: string;
};

export const securitySettings: SecuritySettings = {
  mfaRequired: true,
  loginAlerts: true,
  trustedDevicesOnly: false,
  sessionTimeoutMinutes: 30,
  saveCount: 1,
  lastMessage: "Security settings loaded."
};
