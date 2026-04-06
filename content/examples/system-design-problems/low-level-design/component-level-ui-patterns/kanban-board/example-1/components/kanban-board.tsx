'use client';
import { useState } from 'react';
import type { KanbanColumn, KanbanCard } from './lib/kanban-types';

export function KanbanBoard({ columns: initialColumns, cards: initialCards }: { columns: KanbanColumn[]; cards: KanbanCard[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);

  const moveCard = (cardId: string, fromCol: string, toCol: string) => {
    setColumns((cols) => cols.map((c) => {
      if (c.id === fromCol) return { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) };
      if (c.id === toCol) return { ...c, cardIds: [...c.cardIds, cardId] };
      return c;
    }));
    setCards((cs) => cs.map((c) => c.id === cardId ? { ...c, columnId: toCol } : c));
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto p-4">
      {columns.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{col.title} ({col.cardIds.length})</h3>
          <div className="space-y-2">
            {col.cardIds.map((cardId) => {
              const card = cards.find((c) => c.id === cardId);
              if (!card) return null;
              return (
                <div key={card.id} draggable onDragEnd={(e) => {
                  const target = (e.target as HTMLElement).closest('[data-column]') as HTMLElement | null;
                  const toCol = target?.dataset.column;
                  if (toCol && toCol !== card.columnId) moveCard(card.id, card.columnId, toCol);
                }} className="bg-white dark:bg-gray-700 rounded p-3 shadow cursor-grab">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{card.title}</p>
                  {card.assignee && <p className="text-xs text-gray-500 mt-1">{card.assignee}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
