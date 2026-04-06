/**
 * Chat/Messaging — Staff-Level Message Search and Filtering.
 *
 * Staff differentiator: Full-text search across message history with
 * debounced indexing, sender filtering, date range filtering, and
 * result highlighting.
 */

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}

export interface SearchOptions {
  query?: string;
  senderId?: string;
  dateFrom?: number;
  dateTo?: number;
  limit?: number;
}

/**
 * In-memory message search with inverted index for fast full-text search.
 */
export class MessageSearchEngine {
  private messages: Message[] = [];
  private index: Map<string, Set<number>> = new Map(); // word → message indices

  /**
   * Builds the search index from messages.
   */
  buildIndex(messages: Message[]): void {
    this.messages = messages;
    this.index.clear();

    for (let i = 0; i < messages.length; i++) {
      const words = messages[i].content.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length < 2) continue;
        if (!this.index.has(word)) this.index.set(word, new Set());
        this.index.get(word)!.add(i);
      }
    }
  }

  /**
   * Searches messages with full-text, sender, and date filters.
   */
  search(options: SearchOptions): { messages: Message[]; totalMatches: number } {
    let candidateIndices: Set<number> | null = null;

    // Full-text search
    if (options.query) {
      const words = options.query.toLowerCase().split(/\s+/);
      for (const word of words) {
        const wordIndices = this.index.get(word);
        if (!wordIndices) {
          candidateIndices = new Set();
          break;
        }
        if (!candidateIndices) {
          candidateIndices = new Set(wordIndices);
        } else {
          // Intersection
          candidateIndices = new Set([...candidateIndices].filter((i) => wordIndices.has(i)));
        }
      }
    }

    // Apply sender filter
    if (options.senderId) {
      const senderIndices = new Set<number>();
      this.messages.forEach((m, i) => { if (m.senderId === options.senderId) senderIndices.add(i); });

      if (candidateIndices) {
        candidateIndices = new Set([...candidateIndices].filter((i) => senderIndices.has(i)));
      } else {
        candidateIndices = senderIndices;
      }
    }

    // Apply date range filter
    if (options.dateFrom || options.dateTo) {
      const dateIndices = new Set<number>();
      this.messages.forEach((m, i) => {
        if (options.dateFrom && m.timestamp < options.dateFrom) return;
        if (options.dateTo && m.timestamp > options.dateTo) return;
        dateIndices.add(i);
      });

      if (candidateIndices) {
        candidateIndices = new Set([...candidateIndices].filter((i) => dateIndices.has(i)));
      } else {
        candidateIndices = dateIndices;
      }
    }

    // Default: all messages
    if (!candidateIndices) {
      candidateIndices = new Set(this.messages.map((_, i) => i));
    }

    // Sort by timestamp (newest first) and apply limit
    const sortedIndices = Array.from(candidateIndices).sort(
      (a, b) => this.messages[b].timestamp - this.messages[a].timestamp,
    );

    const limit = options.limit || 50;
    const resultIndices = sortedIndices.slice(0, limit);

    return {
      messages: resultIndices.map((i) => this.messages[i]),
      totalMatches: sortedIndices.length,
    };
  }
}
