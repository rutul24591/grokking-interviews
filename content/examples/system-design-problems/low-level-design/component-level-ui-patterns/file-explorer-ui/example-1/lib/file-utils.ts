import type { FileCategory } from "../lib/explorer-types";

const EXTENSION_TO_CATEGORY: Record<string, FileCategory> = {
  // Images
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  svg: "image",
  webp: "image",
  bmp: "image",
  ico: "image",
  tiff: "image",
  avif: "image",

  // Documents
  pdf: "document",
  doc: "document",
  docx: "document",
  txt: "document",
  rtf: "document",
  odt: "document",
  md: "document",
  html: "document",
  htm: "document",

  // Spreadsheets
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  csv: "spreadsheet",
  ods: "spreadsheet",
  numbers: "spreadsheet",

  // Presentations
  ppt: "presentation",
  pptx: "presentation",
  odp: "presentation",
  key: "presentation",

  // Video
  mp4: "video",
  avi: "video",
  mkv: "video",
  mov: "video",
  wmv: "video",
  flv: "video",
  webm: "video",
  m4v: "video",

  // Audio
  mp3: "audio",
  wav: "audio",
  flac: "audio",
  aac: "audio",
  ogg: "audio",
  wma: "audio",
  m4a: "audio",
  opus: "audio",

  // Archives
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
  bz2: "archive",
  xz: "archive",
  dmg: "archive",

  // Code
  js: "code",
  ts: "code",
  tsx: "code",
  jsx: "code",
  py: "code",
  java: "code",
  c: "code",
  cpp: "code",
  h: "code",
  hpp: "code",
  rs: "code",
  go: "code",
  rb: "code",
  php: "code",
  swift: "code",
  kt: "code",
  cs: "code",
  sh: "code",
  bash: "code",
  zsh: "code",
  sql: "code",
  css: "code",
  scss: "code",
  sass: "code",
  less: "code",
  json: "code",
  yaml: "code",
  yml: "code",
  xml: "code",
  toml: "code",
  ini: "code",

  // Fonts
  ttf: "font",
  otf: "font",
  woff: "font",
  woff2: "font",
  eot: "font",

  // Executables
  exe: "executable",
  msi: "executable",
  app: "executable",
  apk: "executable",
  deb: "executable",
  rpm: "executable",
};

export function detectFileType(extension: string): FileCategory {
  const normalized = extension.replace(/^\.+/, "").toLowerCase();
  return EXTENSION_TO_CATEGORY[normalized] ?? "other";
}

const CATEGORY_ICONS: Record<FileCategory, string> = {
  image: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  document: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z",
  video: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
  audio: "M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  archive: "M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H10v-2h4v2zm0-4H10v-2h4v2z",
  code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  spreadsheet: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h4v2H7V7zm6 0h4v2h-4V7zM7 11h4v2H7v-2zm6 0h4v2h-4v-2zM7 15h4v2H7v-2zm6 0h4v2h-4v-2z",
  presentation: "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-2l-4-4h3V9h2v4h3l-4 4z",
  font: "M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z",
  executable: "M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z",
  other: "M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8l-6-6H6z",
};

export function getFileIcon(category: FileCategory): string {
  return CATEGORY_ICONS[category] ?? CATEGORY_ICONS.other;
}

export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const clampedIndex = Math.min(i, units.length - 1);
  const size = (bytes / Math.pow(k, clampedIndex)).toFixed(decimals);

  return `${size} ${units[clampedIndex]}`;
}

export function generateThumbnailUrl(
  file: { id: string; thumbnailUrl?: string },
  size: "small" | "medium" | "large" = "medium"
): string | undefined {
  if (!file.thumbnailUrl) return undefined;

  const sizeMap: Record<string, number> = {
    small: 64,
    medium: 256,
    large: 512,
  };

  const pixelSize = sizeMap[size];
  const separator = file.thumbnailUrl.includes("?") ? "&" : "?";
  return `${file.thumbnailUrl}${separator}size=${pixelSize}`;
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length <= 1) return "";
  return parts[parts.length - 1]?.toLowerCase() ?? "";
}
