export type FileLike = { name: string; size: number; type: string };

export type FileConstraints = {
  maxFiles: number;
  maxBytesPerFile: number;
  allowedMimePrefixes: string[]; // e.g. ["image/", "video/"]
};

export function validateFiles(files: FileLike[], c: FileConstraints) {
  const issues: string[] = [];
  if (files.length > c.maxFiles) issues.push(`Too many files (max ${c.maxFiles}).`);
  for (const f of files) {
    if (f.size > c.maxBytesPerFile) issues.push(`${f.name}: file too large.`);
    if (!c.allowedMimePrefixes.some((p) => f.type.startsWith(p))) issues.push(`${f.name}: type not allowed.`);
  }
  return issues;
}

