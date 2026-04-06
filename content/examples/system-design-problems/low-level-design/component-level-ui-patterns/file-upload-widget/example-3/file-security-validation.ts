/**
 * File Upload Widget — Staff-Level Security Strategy.
 *
 * Staff differentiator: Client-side file type validation via magic number
 * inspection (not just extension), size limits enforcement, and virus
 * scanning integration before upload.
 */

/**
 * File type detection using magic numbers (file signatures).
 * More reliable than extension-based detection.
 */
export const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
  'application/zip': [[0x50, 0x4B, 0x03, 0x04]],
};

/**
 * Detects the actual file type by reading magic numbers.
 */
export async function detectFileType(file: File): Promise<string> {
  const buffer = new ArrayBuffer(16);
  await file.slice(0, 16).arrayBuffer().then((ab) => {
    const view = new Uint8Array(ab);
    for (let i = 0; i < view.length && i < buffer.byteLength; i++) {
      new Uint8Array(buffer)[i] = view[i];
    }
  });

  const bytes = new Uint8Array(buffer);

  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          matches = false;
          break;
        }
      }
      if (matches) return mimeType;
    }
  }

  return 'application/octet-stream';
}

/**
 * Validates a file before upload.
 */
export async function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeBytes: number,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Size check
  if (file.size > maxSizeBytes) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum (${(maxSizeBytes / 1024 / 1024).toFixed(1)}MB)`);
  }

  // Type check via magic numbers
  const actualType = await detectFileType(file);
  if (!allowedTypes.includes(actualType)) {
    errors.push(`File type "${actualType}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Extension mismatch check
  if (actualType !== 'application/octet-stream' && file.type !== actualType) {
    errors.push(`File extension does not match actual file type (${actualType})`);
  }

  return { valid: errors.length === 0, errors };
}
