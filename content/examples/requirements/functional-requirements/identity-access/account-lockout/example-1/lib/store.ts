export type LockoutState = {
  email: string;
  failedAttempts: number;
  threshold: number;
  lockoutUntil: number | null;
  lastOutcome: string;
};

export const state: LockoutState = {
  email: "analyst@example.com",
  failedAttempts: 0,
  threshold: 3,
  lockoutUntil: null,
  lastOutcome: "No attempts yet.",
};

export function currentState() {
  const now = Date.now();
  const locked = Boolean(state.lockoutUntil && state.lockoutUntil > now);
  return {
    ...state,
    locked,
    secondsRemaining: locked ? Math.ceil(((state.lockoutUntil ?? now) - now) / 1000) : 0,
  };
}

export function attemptLogin(password: string) {
  const now = Date.now();
  if (state.lockoutUntil && state.lockoutUntil > now) {
    state.lastOutcome = "Login blocked because the account is currently locked.";
    return currentState();
  }

  if (password === "CorrectHorseBatteryStaple") {
    state.failedAttempts = 0;
    state.lockoutUntil = null;
    state.lastOutcome = "Successful login reset the failure counter.";
    return currentState();
  }

  state.failedAttempts += 1;
  if (state.failedAttempts >= state.threshold) {
    state.lockoutUntil = now + 5 * 60 * 1000;
    state.lastOutcome = "Threshold reached. Account is locked for five minutes.";
  } else {
    state.lastOutcome = `Invalid credentials. ${state.threshold - state.failedAttempts} attempt(s) remain before lockout.`;
  }
  return currentState();
}
