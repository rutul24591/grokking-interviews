export function truncateAtWord(input: string, maxChars: number): string {
  if (input.length <= maxChars) return input;
  const slice = input.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice).trimEnd() + "…";
}

export function titleTemplate(params: { page: string; brand: string; maxChars?: number }) {
  const max = params.maxChars ?? 60;
  return truncateAtWord(`${params.page} | ${params.brand}`, max);
}

export function descriptionTemplate(params: { summary: string; brandHint?: string; maxChars?: number }) {
  const max = params.maxChars ?? 160;
  const suffix = params.brandHint ? ` ${params.brandHint}` : "";
  return truncateAtWord(`${params.summary}${suffix}`.trim(), max);
}

