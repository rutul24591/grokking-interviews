export type CellCoord = { row: number; col: number }; // 0-based

export function colToName(col: number) {
  let n = col + 1;
  let s = \"\";
  while (n > 0) {\n    const r = (n - 1) % 26;\n    s = String.fromCharCode(65 + r) + s;\n    n = Math.floor((n - 1) / 26);\n  }\n  return s;\n}\n\nexport function nameToCol(name: string) {\n  let n = 0;\n  for (const ch of name.toUpperCase()) {\n    n = n * 26 + (ch.charCodeAt(0) - 64);\n  }\n  return n - 1;\n}\n\nexport function coordToA1(c: CellCoord) {\n  return `${colToName(c.col)}${c.row + 1}`;\n}\n\nexport function a1ToCoord(a1: string): CellCoord {\n  const m = /^([A-Za-z]+)(\\d+)$/.exec(a1.trim());\n  if (!m) throw new Error(`Invalid A1: ${a1}`);\n  return { col: nameToCol(m[1]), row: Number(m[2]) - 1 };\n}\n+
