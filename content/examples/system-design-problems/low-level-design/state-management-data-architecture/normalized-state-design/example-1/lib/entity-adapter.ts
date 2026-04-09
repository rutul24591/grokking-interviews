/**
 * Entity Adapter — Generic CRUD operations for normalized entity tables.
 * Provides O(1) operations for adding, updating, and removing entities by ID.
 */

export type EntityTable<T extends { id: string }> = Record<string, T>;

export interface EntityAdapter<T extends { id: string }> {
  addOne: (entity: T, table: EntityTable<T>) => EntityTable<T>;
  addMany: (entities: T[], table: EntityTable<T>) => EntityTable<T>;
  updateOne: (update: { id: string; changes: Partial<T> }, table: EntityTable<T>) => EntityTable<T>;
  removeOne: (id: string, table: EntityTable<T>) => EntityTable<T>;
  removeAll: (table: EntityTable<T>) => EntityTable<T>;
}

/**
 * Create an entity adapter for a specific entity type.
 * All operations return new table objects (immutable) for React change detection.
 */
export function createEntityAdapter<T extends { id: string }>(): EntityAdapter<T> {
  /**
   * Add or replace a single entity by ID
   */
  function addOne(entity: T, table: EntityTable<T>): EntityTable<T> {
    return {
      ...table,
      [entity.id]: entity,
    };
  }

  /**
   * Add or replace multiple entities
   */
  function addMany(entities: T[], table: EntityTable<T>): EntityTable<T> {
    const newTable = { ...table };
    for (const entity of entities) {
      newTable[entity.id] = entity;
    }
    return newTable;
  }

  /**
   * Update an existing entity by merging changes (shallow merge)
   */
  function updateOne(
    update: { id: string; changes: Partial<T> },
    table: EntityTable<T>,
  ): EntityTable<T> {
    const existing = table[update.id];
    if (!existing) {
      console.warn(`[EntityAdapter] Cannot update missing entity: ${update.id}`);
      return table;
    }

    return {
      ...table,
      [update.id]: { ...existing, ...update.changes },
    };
  }

  /**
   * Remove an entity by ID
   */
  function removeOne(id: string, table: EntityTable<T>): EntityTable<T> {
    if (!table[id]) {
      return table; // No-op for missing entity
    }

    const newTable = { ...table };
    delete newTable[id];
    return newTable;
  }

  /**
   * Remove all entities
   */
  function removeAll(): EntityTable<T> {
    return {};
  }

  return {
    addOne,
    addMany,
    updateOne,
    removeOne,
    removeAll,
  };
}
