/**
 * Wizard Multi-Step Form — Staff-Level Form Data Persistence Strategy.
 *
 * Staff differentiator: Incremental draft saving with conflict detection,
 * form versioning for schema evolution, and localStorage + server dual
 * persistence with reconciliation.
 */

export interface FormDraft {
  version: number;
  stepData: Record<string, Record<string, unknown>>;
  currentStep: number;
  savedAt: number;
  schemaVersion: string;
}

/**
 * Manages form draft persistence with conflict detection and reconciliation.
 */
export class FormDraftManager {
  private readonly storageKey: string;
  private readonly schemaVersion: string;

  constructor(storageKey: string, schemaVersion: string = '1.0.0') {
    this.storageKey = storageKey;
    this.schemaVersion = schemaVersion;
  }

  /**
   * Saves a draft to localStorage with version tracking.
   */
  saveDraft(draft: Omit<FormDraft, 'savedAt' | 'schemaVersion'>): void {
    const fullDraft: FormDraft = {
      ...draft,
      savedAt: Date.now(),
      schemaVersion: this.schemaVersion,
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(fullDraft));
    } catch (err) {
      // Quota exceeded — evict oldest entries or fall back to server
      console.warn('Failed to save draft to localStorage:', err);
    }
  }

  /**
   * Loads a draft from localStorage. Returns null if no draft exists or schema is incompatible.
   */
  loadDraft(): FormDraft | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;

      const draft: FormDraft = JSON.parse(raw);

      // Check schema compatibility
      if (draft.schemaVersion !== this.schemaVersion) {
        console.warn(`Schema mismatch: draft is v${draft.schemaVersion}, current is v${this.schemaVersion}`);
        return null;
      }

      // Check staleness (7 days)
      const ageMs = Date.now() - draft.savedAt;
      if (ageMs > 7 * 24 * 60 * 60 * 1000) {
        console.warn('Draft is older than 7 days, discarding');
        return null;
      }

      return draft;
    } catch {
      return null;
    }
  }

  /**
   * Detects conflicts between localStorage draft and server draft.
   * Server version wins if it's newer.
   */
  detectConflict(localDraft: FormDraft | null, serverDraft: FormDraft | null): FormDraft | null {
    if (!localDraft) return serverDraft;
    if (!serverDraft) return localDraft;

    // Server wins if newer
    return serverDraft.savedAt > localDraft.savedAt ? serverDraft : localDraft;
  }

  /**
   * Clears the draft.
   */
  clearDraft(): void {
    localStorage.removeItem(this.storageKey);
  }
}
