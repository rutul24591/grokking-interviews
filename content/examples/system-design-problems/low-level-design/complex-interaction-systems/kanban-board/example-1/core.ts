export type CardId = string;
export type ColumnId = string;

export type Board = {
  columns: Record<ColumnId, { id: ColumnId; title: string; cardIds: CardId[] }>;
  cards: Record<CardId, { id: CardId; title: string }>;
};

export type Move = {
  cardId: CardId;
  from: { columnId: ColumnId; index: number };
  to: { columnId: ColumnId; index: number };
};

export function applyMove(board: Board, move: Move): Board {
  const fromCol = board.columns[move.from.columnId];
  const toCol = board.columns[move.to.columnId];
  if (!fromCol || !toCol) return board;

  const nextFrom = fromCol.cardIds.slice();
  nextFrom.splice(move.from.index, 1);

  const nextTo = (move.from.columnId === move.to.columnId ? nextFrom : toCol.cardIds.slice());
  nextTo.splice(move.to.index, 0, move.cardId);

  return {
    ...board,
    columns: {
      ...board.columns,
      [fromCol.id]: { ...fromCol, cardIds: nextFrom },
      [toCol.id]: { ...toCol, cardIds: nextTo },
    },
  };
}

export function optimisticMove(board: Board, move: Move) {
  const optimistic = applyMove(board, move);
  const rollback = () => board;
  return { optimistic, rollback };
}
