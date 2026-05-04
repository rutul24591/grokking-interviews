export type DeviceSession = {
  id: string;
  deviceName: string;
  ip: string;
  location?: string;
  lastActiveAt: number;
  current: boolean;
};

export type SessionsState = {
  sessions: DeviceSession[];
  revoking: Set<string>;
};

export function sortSessions(sessions: DeviceSession[]) {
  return [...sessions].sort((a, b) => Number(b.current) - Number(a.current) || b.lastActiveAt - a.lastActiveAt);
}

export function startRevoke(state: SessionsState, sessionId: string) {
  const revoking = new Set(state.revoking);
  revoking.add(sessionId);
  return { ...state, revoking };
}

export function finishRevoke(state: SessionsState, sessionId: string) {
  const revoking = new Set(state.revoking);
  revoking.delete(sessionId);
  return { ...state, revoking, sessions: state.sessions.filter((s) => s.id !== sessionId) };
}
