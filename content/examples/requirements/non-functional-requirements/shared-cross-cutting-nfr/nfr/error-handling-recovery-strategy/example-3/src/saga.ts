export type Step = {
  name: string;
  run: () => Promise<void>;
  compensate: () => Promise<void>;
};

export async function runSaga(steps: Step[]) {
  const completed: Step[] = [];
  try {
    for (const s of steps) {
      await s.run();
      completed.push(s);
    }
    return { ok: true };
  } catch (e) {
    for (const s of completed.reverse()) {
      try {
        await s.compensate();
      } catch {
        // best-effort; real systems record compensation failures.
      }
    }
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

