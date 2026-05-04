export type AuthStep =
  | { kind: "enterCredentials" }
  | { kind: "mfaChallenge"; method: "totp" | "sms" }
  | { kind: "authenticated"; userId: string }
  | { kind: "error"; message: string; retryable: boolean };

export type AuthState = {
  step: AuthStep;
  attemptId: number; // prevents stale responses overwriting
  lastAttemptAt: number | null;
};

export type AuthApi = {
  login: (args: { email: string; password: string }, signal: AbortSignal) => Promise<{ mfa?: "totp" | "sms"; userId?: string }>;
  verifyMfa: (args: { code: string }, signal: AbortSignal) => Promise<{ userId: string }>;
};

export function createAuthController(api: AuthApi) {
  let state: AuthState = { step: { kind: "enterCredentials" }, attemptId: 0, lastAttemptAt: null };
  let abort: AbortController | null = null;

  const getState = () => state;
  const setState = (s: AuthState) => { state = s; };

  async function startLogin(email: string, password: string) {
    abort?.abort();
    abort = new AbortController();
    const attemptId = getState().attemptId + 1;
    setState({ ...getState(), attemptId, lastAttemptAt: Date.now() });

    try {
      const res = await api.login({ email, password }, abort.signal);
      if (getState().attemptId != attemptId) return;
      if (res.mfa) {
        setState({ ...getState(), step: { kind: "mfaChallenge", method: res.mfa } });
      } else if (res.userId) {
        setState({ ...getState(), step: { kind: "authenticated", userId: res.userId } });
      } else {
        setState({ ...getState(), step: { kind: "error", message: "invalid response", retryable: true } });
      }
    } catch (e) {
      if (abort.signal.aborted) return;
      setState({ ...getState(), step: { kind: "error", message: e instanceof Error ? e.message : "login failed", retryable: true } });
    }
  }

  async function submitMfa(code: string) {
    const s = getState();
    if (s.step.kind !== "mfaChallenge") return;
    abort?.abort();
    abort = new AbortController();
    const attemptId = s.attemptId + 1;
    setState({ ...s, attemptId });

    try {
      const res = await api.verifyMfa({ code }, abort.signal);
      if (getState().attemptId != attemptId) return;
      setState({ ...getState(), step: { kind: "authenticated", userId: res.userId } });
    } catch (e) {
      if (abort.signal.aborted) return;
      setState({ ...getState(), step: { kind: "error", message: e instanceof Error ? e.message : "mfa failed", retryable: true } });
    }
  }

  return { getState, startLogin, submitMfa, cancel: () => abort?.abort() };
}
