import type { Suggestion, CacheEntry } from './multi-select-types';

const STORAGE_KEY = 'multi-select-tag-cache';

export class TagCache<T = Record<string, unknown>> {
  private cache: Map<string, CacheEntry<T>>;
  private customTags: Set<string>;
  private maxSize: number;
  private namespace: string;
  private persistToStorage: boolean;

  constructor(options?: { maxSize?: number; namespace?: string; persist?: boolean }) {
    this.maxSize = options?.maxSize ?? 100;
    this.namespace = options?.namespace ?? 'default';
    this.persistToStorage = options?.persist ?? false;
    this.cache = new Map();
    this.customTags = new Set();

    if (this.persistToStorage) {
      this.loadFromStorage();
    }
  }

  private getStorageKey(): string {
    return `${STORAGE_KEY}:${this.namespace}`;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((entry: CacheEntry<T>) => {
            this.cache.set(entry.query, entry);
          });
        }
        if (Array.isArray(parsed.customTags)) {
          parsed.customTags.forEach((tag: string) => this.customTags.add(tag));
        }
      }
    } catch {
      // Corrupted storage — start fresh
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !this.persistToStorage) return;
    try {
      const entries = Array.from(this.cache.values());
      const data = {
        entries,
        customTags: Array.from(this.customTags),
      };
      localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }

  private evictIfNeeded(): void {
    if (this.cache.size <= this.maxSize) return;
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this.cache) {
      if (entry.accessedAt < oldestTime) {
        oldestTime = entry.accessedAt;
        oldestKey = key;
      }
    }
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  get(query: string): Suggestion<T>[] | null {
    const key = `${this.namespace}:${query.toLowerCase()}`;
    const entry = this.cache.get(key);
    if (!entry) return null;
    entry.accessedAt = Date.now();
    return entry.suggestions;
  }

  has(query: string): boolean {
    const key = `${this.namespace}:${query.toLowerCase()}`;
    return this.cache.has(key);
  }

  set(query: string, suggestions: Suggestion<T>[]): void {
    const key = `${this.namespace}:${query.toLowerCase()}`;
    this.evictIfNeeded();
    this.cache.set(key, {
      query,
      suggestions,
      accessedAt: Date.now(),
    });
    this.saveToStorage();
  }

  addCustomTag(label: string): boolean {
    const normalized = label.toLowerCase().trim();
    if (this.customTags.has(normalized)) return false;
    this.customTags.add(normalized);
    this.saveToStorage();
    return true;
  }

  isCustomTag(label: string): boolean {
    return this.customTags.has(label.toLowerCase().trim());
  }

  clear(): void {
    this.cache.clear();
    this.customTags.clear();
    if (this.persistToStorage && typeof window !== 'undefined') {
      localStorage.removeItem(this.getStorageKey());
    }
  }

  size(): number {
    return this.cache.size;
  }

  customTagCount(): number {
    return this.customTags.size;
  }
}

// Singleton cache instance shared across components
let globalCache: TagCache | null = null;

export function getGlobalCache<T = Record<string, unknown>>(options?: {
  maxSize?: number;
  namespace?: string;
  persist?: boolean;
}): TagCache<T> {
  if (!globalCache) {
    globalCache = new TagCache(options);
  }
  return globalCache as TagCache<T>;
}
