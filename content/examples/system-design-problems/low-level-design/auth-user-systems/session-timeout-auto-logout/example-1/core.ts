export type TimeoutPolicy = {
  idleMs: number;
  absoluteMs: number;
  warningMs: number; // show warning before logout
};

export type TimeoutState = {
  issuedAt: number;
  lastActiveAt: number;
  warned: boolean;
  loggedOut: boolean;
};

export function init(policy: TimeoutPolicy, now = Date.now()): TimeoutState {
  return { issuedAt: now, lastActiveAt: now, warned: false, loggedOut: false };
}

export function touch(state: TimeoutState, now = Date.now()) {
  return { ...state, lastActiveAt: now };
}

export function tick(policy: TimeoutPolicy, state: TimeoutState, now = Date.now()) {
  if (state.loggedOut) return state;
  const idleFor = now - state.lastActiveAt;
  const age = now - state.issuedAt;
  const shouldLogout = idleFor >= policy.idleMs || age >= policy.absoluteMs;
  if (shouldLogout) return { ...state, loggedOut: true };

  const shouldWarn = !state.warned && idleFor >= policy.idleMs - policy.warningMs;
  return shouldWarn ? { ...state, warned: true } : state;
}
