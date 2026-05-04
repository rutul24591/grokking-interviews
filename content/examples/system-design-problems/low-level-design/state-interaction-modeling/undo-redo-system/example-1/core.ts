export type Command = { name: string; do: () => void; undo: () => void };

export function createUndoStack(limit = 100) {
  const past: Command[] = [];
  const future: Command[] = [];
  return {
    exec(cmd: Command) {
      cmd.do();
      past.push(cmd);
      if (past.length > limit) past.shift();
      future.length = 0;
    },
    undo() {
      const c = past.pop();
      if (!c) return;
      c.undo();
      future.push(c);
    },
    redo() {
      const c = future.pop();
      if (!c) return;
      c.do();
      past.push(c);
    },
  };
}
