export type LightboxState = {
  open: boolean;
  index: number;
  zoom: number; // 1..N
  panX: number;
  panY: number;
};

export function openAt(index: number): LightboxState {
  return { open: true, index, zoom: 1, panX: 0, panY: 0 };
}

export function close(s: LightboxState): LightboxState {
  return { ...s, open: false, zoom: 1, panX: 0, panY: 0 };
}

export function next(s: LightboxState, total: number) {
  return { ...s, index: (s.index + 1) % total, zoom: 1, panX: 0, panY: 0 };
}

export function prev(s: LightboxState, total: number) {
  return { ...s, index: (s.index - 1 + total) % total, zoom: 1, panX: 0, panY: 0 };
}

