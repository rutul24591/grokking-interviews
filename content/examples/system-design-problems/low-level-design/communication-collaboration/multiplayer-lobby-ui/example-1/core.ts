export type Player = {
  id: string;
  name: string;
  ready: boolean;
  joinedAt: number;
};

export type LobbyState = {
  lobbyId: string;
  players: Record<string, Player>;
  order: string[];
  phase: "waiting" | "matching" | "starting";
};

export function setReady(state: LobbyState, playerId: string, ready: boolean) {
  const p = state.players[playerId];
  if (!p) return state;
  return { ...state, players: { ...state.players, [playerId]: { ...p, ready } } };
}

export function canStart(state: LobbyState) {
  const ps = state.order.map((id) => state.players[id]).filter(Boolean);
  return ps.length >= 2 && ps.every((p) => p.ready);
}
