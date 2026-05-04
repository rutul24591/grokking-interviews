export type View = { id: string; name: string; payload: unknown; version: number };

export function serialize(v: View) {
  return JSON.stringify(v);
}
