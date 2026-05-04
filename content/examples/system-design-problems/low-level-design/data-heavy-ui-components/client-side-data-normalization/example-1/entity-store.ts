export type EntityId = string;
export type EntityType = string;

export type Entity = { id: EntityId; [k: string]: unknown };

export type EntityState = {
  entities: Record<EntityType, Record<EntityId, Entity>>;
};

export function upsert(state: EntityState, type: EntityType, e: Entity) {
  const bucket = state.entities[type] ?? {};
  const prev = bucket[e.id] ?? { id: e.id };
  return {
    entities: {
      ...state.entities,
      [type]: { ...bucket, [e.id]: { ...prev, ...e } },
    },
  };
}

export function upsertMany(state: EntityState, type: EntityType, entities: Entity[]) {
  let next = state;
  for (const e of entities) next = upsert(next, type, e);
  return next;
}

export type IdList = { ids: EntityId[]; nextCursor?: string | null };

export function mergeIdList(prev: IdList, incoming: IdList) {
  const set = new Set(prev.ids);
  const ids = [...prev.ids];
  for (const id of incoming.ids) if (!set.has(id)) ids.push(id);
  return { ids, nextCursor: incoming.nextCursor ?? prev.nextCursor ?? null };
}

