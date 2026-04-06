export type BlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer';
export interface Block { id: string; type: BlockType; config: Record<string, unknown>; }
export interface Template { id: string; name: string; blocks: Block[]; }
