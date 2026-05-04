export type Id = string;

export type Entity<T> = T & { id: Id };

export function newId(prefix: string, now = Date.now()) {
  return `${prefix}_${now}_${Math.floor(Math.random() * 1e6)}`;
}
