export type Version = { id: string; at: number; authorId: string; summary: string };

export function pinLatest(versions: Version[]) {
  return [...versions].sort((a, b) => b.at - a.at);
}
