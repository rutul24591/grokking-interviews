export type FullTextSearchUiStatus = "closed" | "debouncing" | "loading" | "open" | "empty" | "failed";
export interface FullTextSearchUiSnapshot { status: FullTextSearchUiStatus; query: string; focused: boolean; requestToken: number; suggestions: string[]; highlightedIndex: number; }
export class FullTextSearchUiCoordinator {
  private snapshot: FullTextSearchUiSnapshot = { status: "closed", query: "", focused: false, requestToken: 0, suggestions: [], highlightedIndex: -1 };
  focus() { this.snapshot = { ...this.snapshot, focused: true, status: this.snapshot.suggestions.length ? "open" : "closed" }; return this.get(); }
  blur() { this.snapshot = { ...this.snapshot, focused: false, status: "closed", highlightedIndex: -1 }; return this.get(); }
  query(value: string) { this.snapshot = { ...this.snapshot, query: value, requestToken: this.snapshot.requestToken + 1, status: value ? "debouncing" : "closed" }; return this.get(); }
  settle(token: number, suggestions: string[]) { if (token !== this.snapshot.requestToken || !this.snapshot.focused) return this.get(); this.snapshot = { ...this.snapshot, suggestions, status: suggestions.length ? "open" : "empty", highlightedIndex: suggestions.length ? 0 : -1 }; return this.get(); }
  move(delta: number) { if (!this.snapshot.suggestions.length) return this.get(); const n=this.snapshot.suggestions.length; this.snapshot={...this.snapshot,highlightedIndex:(this.snapshot.highlightedIndex+delta+n)%n}; return this.get(); }
  get(){ return {...this.snapshot,suggestions:[...this.snapshot.suggestions]}; }
}
export function runFullTextSearchUiFocusScenario(){const c=new FullTextSearchUiCoordinator();c.focus();const pending=c.query("rea");c.blur();const ignored=c.settle(pending.requestToken,["react","reason"]);return{invariant:"Search results must remain attributable to the active query while pagination, sorting, and retries overlap.",ignored};}
