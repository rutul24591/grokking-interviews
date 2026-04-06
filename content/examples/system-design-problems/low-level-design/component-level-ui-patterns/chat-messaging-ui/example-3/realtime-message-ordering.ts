/**
 * Chat/Messaging — Staff-Level Real-Time Sync Strategy.
 *
 * Staff differentiator: WebSocket message ordering with Lamport timestamps,
 * gap detection and reconciliation, and optimistic message reconciliation
 * with server-acknowledged ordering.
 */

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  lamportTimestamp: number;
  serverTimestamp: number;
  isOptimistic: boolean;
}

/**
 * Manages message ordering using Lamport timestamps.
 * Handles out-of-order delivery and gap detection.
 */
export class MessageOrderingManager {
  private messages: ChatMessage[] = [];
  private localTimestamp: number = 0;
  private expectedSequence: number = 0;
  private pendingGaps: number[] = [];

  /**
   * Increments local Lamport clock and returns the new timestamp.
   */
  tick(): number {
    this.localTimestamp++;
    return this.localTimestamp;
  }

  /**
   * Merges a remote message's timestamp into local clock.
   */
  receiveTimestamp(remoteTs: number): number {
    this.localTimestamp = Math.max(this.localTimestamp, remoteTs) + 1;
    return this.localTimestamp;
  }

  /**
   * Inserts a message maintaining Lamport timestamp ordering.
   * Detects gaps (missing sequence numbers) for reconciliation.
   */
  insertMessage(message: ChatMessage): void {
    // Merge timestamp
    this.receiveTimestamp(message.lamportTimestamp);

    // Insert in sorted order by Lamport timestamp, then server timestamp as tiebreaker
    const insertIndex = this.messages.findIndex(
      (m) => m.lamportTimestamp > message.lamportTimestamp ||
        (m.lamportTimestamp === message.lamportTimestamp && m.serverTimestamp > message.serverTimestamp),
    );

    if (insertIndex === -1) {
      this.messages.push(message);
    } else {
      this.messages.splice(insertIndex, 0, message);
    }

    // Check for gaps
    this.detectGaps();
  }

  /**
   * Detects missing sequence numbers that indicate dropped messages.
   */
  private detectGaps(): void {
    const sorted = [...this.messages].sort((a, b) => a.lamportTimestamp - b.lamportTimestamp);
    const gaps: number[] = [];

    for (let i = 1; i < sorted.length; i++) {
      const diff = sorted[i].lamportTimestamp - sorted[i - 1].lamportTimestamp;
      if (diff > 1) {
        for (let j = 1; j < diff; j++) {
          gaps.push(sorted[i - 1].lamportTimestamp + j);
        }
      }
    }

    this.pendingGaps = gaps;
  }

  /**
   * Returns messages that need reconciliation (gaps in the sequence).
   */
  getMissingSequences(): number[] {
    return [...this.pendingGaps];
  }

  /**
   * Replaces an optimistic message with its server-confirmed version.
   */
  confirmMessage(tempId: string, serverMessage: ChatMessage): void {
    const index = this.messages.findIndex((m) => m.id === tempId);
    if (index !== -1) {
      this.messages[index] = { ...serverMessage, isOptimistic: false };
      this.receiveTimestamp(serverMessage.lamportTimestamp);
    }
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }
}
