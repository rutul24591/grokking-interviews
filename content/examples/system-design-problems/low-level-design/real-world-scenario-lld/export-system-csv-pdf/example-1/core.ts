export function toCsv(rows: Array<Record<string, unknown>>, headers: string[]) {
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",
]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("
");
}
