export type FileLike = { name: string; size: number; type: string };

export function validateDropped(files: FileLike[], maxFiles: number, maxBytes: number) {
  const issues: string[] = [];
  if (files.length > maxFiles) issues.push(`too many files (max ${maxFiles})`);
  for (const f of files) if (f.size > maxBytes) issues.push(`${f.name} too large`);
  return issues;
}
