export function safeTitle(input: string) {
  const stripped = input.replace(/\s+/g, " ").trim();
  return (stripped.length > 60 ? stripped.slice(0, 57) + "…" : stripped) || "Untitled";
}

