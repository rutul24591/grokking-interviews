export type ClipboardAdapter = {
  writeText: (text: string) => Promise<void>;
  readText: () => Promise<string>;
};

export function safeClipboard(): ClipboardAdapter | null {
  if (typeof navigator === "undefined" || !navigator.clipboard) return null;
  return { writeText: (t) => navigator.clipboard.writeText(t), readText: () => navigator.clipboard.readText() };
}
