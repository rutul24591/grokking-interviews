export type OAuthProvider = {
  name: string;
  available: boolean;
  scopes: string[];
  redirectUri: string;
};

export const oauth = {
  started: false,
  provider: "google",
  code: "oauth-code-123",
  completed: false,
  stateToken: "state-789",
  redirectUri: "/auth/callback",
  providers: [
    { name: "google", available: true, scopes: ["openid", "email", "profile"], redirectUri: "/auth/callback" },
    { name: "github", available: true, scopes: ["read:user", "user:email"], redirectUri: "/auth/callback" },
    { name: "microsoft", available: false, scopes: ["openid", "profile"], redirectUri: "/auth/callback" }
  ] as OAuthProvider[],
  lastMessage: "OAuth flow not started."
};
