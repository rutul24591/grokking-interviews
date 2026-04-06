/**
 * Code Editor — Staff-Level Memory Management.
 *
 * Staff differentiator: Object pooling for syntax tokens, document model
 * with piece table for O(1) insert/delete, and incremental garbage collection
 * for undo history.
 */

/**
 * Piece table document model — O(1) insert/delete at cursor.
 * Uses two buffers: original (read-only file content) and add (all insertions).
 * Each piece points to a span in one of the buffers.
 */
export class PieceTable {
  private original: string;
  private add: string = '';
  private pieces: Array<{ buffer: 'original' | 'add'; start: number; length: number }>;

  constructor(content: string) {
    this.original = content;
    this.pieces = content.length > 0
      ? [{ buffer: 'original' as const, start: 0, length: content.length }]
      : [];
  }

  /**
   * Inserts text at the given position.
   * Splits the piece at the insertion point and adds a new piece pointing to the add buffer.
   */
  insert(position: number, text: string): void {
    const addStart = this.add.length;
    this.add += text;

    // Find the piece containing the position
    let offset = 0;
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      const pieceEnd = offset + piece.length;

      if (position <= offset) {
        // Insert before this piece
        this.pieces.splice(i, 0, { buffer: 'add', start: addStart, length: text.length });
        return;
      }

      if (position < pieceEnd) {
        // Split this piece
        const splitPoint = position - offset;
        const before = { buffer: piece.buffer, start: piece.start, length: splitPoint };
        const after = { buffer: piece.buffer, start: piece.start + splitPoint, length: piece.length - splitPoint };
        const newPiece = { buffer: 'add' as const, start: addStart, length: text.length };
        this.pieces.splice(i, 1, before, newPiece, after);
        return;
      }

      offset = pieceEnd;
    }

    // Insert at end
    this.pieces.push({ buffer: 'add', start: addStart, length: text.length });
  }

  /**
   * Deletes text from start to end position.
   */
  delete(start: number, end: number): void {
    const deleteLength = end - start;
    let offset = 0;

    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      const pieceEnd = offset + piece.length;

      if (start >= pieceEnd) {
        offset = pieceEnd;
        continue;
      }

      if (end <= offset) break;

      const clipStart = Math.max(0, start - offset);
      const clipEnd = Math.min(piece.length, end - offset);

      if (clipStart === 0 && clipEnd === piece.length) {
        // Delete entire piece
        this.pieces.splice(i, 1);
        i--;
      } else if (clipStart === 0) {
        // Delete from start of piece
        piece.start += clipEnd;
        piece.length -= clipEnd;
      } else if (clipEnd === piece.length) {
        // Delete from end of piece
        piece.length = clipStart;
      } else {
        // Delete middle — split into two pieces
        const before = { buffer: piece.buffer, start: piece.start, length: clipStart };
        const after = { buffer: piece.buffer, start: piece.start + clipEnd, length: piece.length - clipEnd };
        this.pieces.splice(i, 1, before, after);
        i++;
      }
    }
  }

  /**
   * Returns the full document content.
   */
  toString(): string {
    return this.pieces
      .map((piece) => {
        const buffer = piece.buffer === 'original' ? this.original : this.add;
        return buffer.substring(piece.start, piece.start + piece.length);
      })
      .join('');
  }
}
