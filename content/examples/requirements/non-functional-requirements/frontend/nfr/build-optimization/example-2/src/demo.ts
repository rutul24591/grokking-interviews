type File = { path: string; content: string };

function scan(files: File[]) {
  const findings: Array<{ path: string; kind: string }> = [];
  for (const f of files) {
    const isBarrel = /(^|\/)index\.ts$/.test(f.path);
    if (!isBarrel) continue;
    if (/export\s+\*\s+from\s+['"]/.test(f.content)) {
      findings.push({ path: f.path, kind: "export-star" });
    }
  }
  return findings;
}

const files: File[] = [
  { path: "src/ui/index.ts", content: "export * from './Button';\\nexport * from './Modal';\\n" },
  { path: "src/ui/Button.ts", content: "export function Button() {}\\n" },
  { path: "src/lib/index.ts", content: "export { thing } from './thing';\\n" },
];

const findings = scan(files);
console.log(JSON.stringify({ findings }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

