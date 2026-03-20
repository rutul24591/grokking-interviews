import ts from "typescript";

const md = `
# Doc

\`\`\`ts
type User = { id: string };
const u: User = { id: "1" };
\`\`\`

\`\`\`ts
// broken snippet
const x: number = "oops";
\`\`\`
`;

function extractTsBlocks(text: string): string[] {
  const blocks: string[] = [];
  const re = /```ts\s*([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) blocks.push(m[1]);
  return blocks;
}

const blocks = extractTsBlocks(md);
const files = blocks.map((code, idx) => ({
  fileName: `snippet-${idx}.ts`,
  content: code,
}));

const host = ts.createCompilerHost(
  {
    target: ts.ScriptTarget.ES2022,
    strict: true,
    noEmit: true,
  },
  true,
);

const originalReadFile = host.readFile.bind(host);
host.readFile = (fileName) => files.find((f) => f.fileName === fileName)?.content ?? originalReadFile(fileName);
host.fileExists = (fileName) => files.some((f) => f.fileName === fileName) || ts.sys.fileExists(fileName);
host.getSourceFile = (fileName, languageVersion) => {
  const f = files.find((x) => x.fileName === fileName);
  if (f) return ts.createSourceFile(fileName, f.content, languageVersion, true);
  const text = ts.sys.readFile(fileName);
  return text ? ts.createSourceFile(fileName, text, languageVersion, true) : undefined;
};

const program = ts.createProgram(files.map((f) => f.fileName), { strict: true, noEmit: true }, host);
const diags = ts.getPreEmitDiagnostics(program);

for (const d of diags) {
  const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
  const file = d.file?.fileName ?? "unknown";
  console.log(`${file}: ${msg}`);
}

if (diags.length) process.exit(1);
console.log({ ok: true, snippets: files.length });

