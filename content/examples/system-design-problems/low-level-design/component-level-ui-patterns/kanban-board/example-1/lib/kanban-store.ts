import type { KanbanColumn, KanbanCard } from './kanban-types';

type Actions = {
  moveCard: (cardId: string, fromCol: string, toCol: string) => void;
  addCard: (colId: string, card: KanbanCard) => void;
  removeCard: (cardId: string) => void;
};

export const createKanbanStore = (initial: { columns: KanbanColumn[]; cards: KanbanCard[] }) => {
  let columns = [...initial.columns];
  let cards = [...initial.cards];

  return {
    getState: () => ({ columns, cards }),
    moveCard: (cardId: string, fromCol: string, toCol: string) => {
      columns = columns.map((c) => {
        if (c.id === fromCol) return { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) };
        if (c.id === toCol) return { ...c, cardIds: [...c.cardIds, cardId] };
        return c;
      });
      cards = cards.map((c) => c.id === cardId ? { ...c, columnId: toCol } : c);
    },
    addCard: (colId: string, card: KanbanCard) => {
      cards.push(card);
      columns = columns.map((c) => c.id === colId ? { ...c, cardIds: [...c.cardIds, card.id] } : c);
    },
    removeCard: (cardId: string) => {
      cards = cards.filter((c) => c.id !== cardId);
      columns = columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }));
    },
  };
};
