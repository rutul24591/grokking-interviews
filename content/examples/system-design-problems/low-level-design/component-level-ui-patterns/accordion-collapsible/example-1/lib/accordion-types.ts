export type AccordionMode = 'exclusive' | 'independent';
export interface AccordionItemProps { id: string; title: string; content: React.ReactNode; disabled?: boolean; }
export interface AccordionConfig { mode: AccordionMode; defaultOpen?: string | string[]; animated?: boolean; }
export interface AccordionContextValue {
  mode: AccordionMode;
  openId: string | null;
  openIds: Set<string>;
  toggle: (id: string) => void;
  disabledIds: Set<string>;
}
