/**
 * Chat/Messaging — Edge Case: Duplicate Message Detection and Deduplication.
 *
 * When WebSocket reconnects, the server may resend messages already received.
 * Detect duplicates by message ID and filter them out.
 */

export function deduplicateMessages(
  existing: Array<{ id: string; content: string; timestamp: number }>,
  incoming: Array<{ id: string; content: string; timestamp: number }>,
): Array<{ id: string; content: string; timestamp: number }> {
  const existingIds = new Set(existing.map((m) => m.id));
  const newMessages = incoming.filter((m) => !existingIds.has(m.id));
  return [...existing, ...newMessages].sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Detects gaps in message sequence (missing messages between known IDs).
 */
export function detectMessageGaps(
  messages: Array<{ id: string; sequenceNumber: number }>,
  expectedTotal: number,
): { hasGaps: boolean; missingSequences: number[] } {
  if (messages.length === 0) return { hasGaps: true, missingSequences: [] };

  const sequences = messages.map((m) => m.sequenceNumber).sort((a, b) => a - b);
  const missing: number[] = [];

  for (let i = 1; i < sequences.length; i++) {
    const expected = sequences[i - 1] + 1;
    if (sequences[i] !== expected) {
      for (let j = expected; j < sequences[i]; j++) {
        missing.push(j);
      }
    }
  }

  return { hasGaps: missing.length > 0, missingSequences: missing };
}
