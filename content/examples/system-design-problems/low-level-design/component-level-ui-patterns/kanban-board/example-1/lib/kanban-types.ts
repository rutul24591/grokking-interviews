export type KanbanColumn = { id: string; title: string; cardIds: string[] };
export type KanbanCard = { id: string; title: string; columnId: string; labels: string[]; assignee?: string; };
export type DragState = { cardId: string; sourceColumn: string; targetColumn?: string; dropIndex?: number; };
