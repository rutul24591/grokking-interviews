export type Component = { name: string; availability: number }; // 0..1

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function serialAvailability(components: Component[]): number {
  return clamp01(components.reduce((p, c) => p * clamp01(c.availability), 1));
}

export function parallelAvailability(components: Component[]): number {
  // independent redundancy: 1 - Π(1-ai)
  const down = components.reduce((p, c) => p * (1 - clamp01(c.availability)), 1);
  return clamp01(1 - down);
}

export function monthlyMinutes(days = 30): number {
  return days * 24 * 60;
}

export function expectedDowntimeMinutes(availability: number, days = 30): number {
  const up = clamp01(availability);
  return (1 - up) * monthlyMinutes(days);
}

export function errorBudgetMinutes(params: { target: number; days?: number }): number {
  return (1 - clamp01(params.target)) * monthlyMinutes(params.days ?? 30);
}

export function formatPct(x: number) {
  return `${(clamp01(x) * 100).toFixed(3)}%`;
}

