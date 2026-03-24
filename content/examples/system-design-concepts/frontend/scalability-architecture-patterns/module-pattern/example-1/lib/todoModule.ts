export type Todo = { id: string; text: string; done: boolean };
type Listener = () => void;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

export function createTodoModule() {
  let todos: Todo[] = [
    { id: "t1", text: "Ship module boundary", done: false },
    { id: "t2", text: "Keep invariants inside the module", done: false }
  ];
  const listeners = new Set<Listener>();

  function emit() {
    for (const l of listeners) l();
  }

  function getSnapshot() {
    return todos;
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function add(text: string) {
    const t = text.trim();
    if (!t) return;
    todos = [{ id: createId(), text: t, done: false }, ...todos];
    emit();
  }

  function toggle(id: string) {
    todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    emit();
  }

  function remove(id: string) {
    todos = todos.filter((t) => t.id !== id);
    emit();
  }

  return { getSnapshot, subscribe, add, toggle, remove };
}

// “Revealing module”: export the public API, keep state private.
export const todoModule = createTodoModule();

