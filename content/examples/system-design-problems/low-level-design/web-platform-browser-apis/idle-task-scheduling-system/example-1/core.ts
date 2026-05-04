export type Task = { id: string; run: () => void; priority: number };

export function schedule(tasks: Task[], budgetMs: number) {
  const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
  const start = Date.now();
  const ran: string[] = [];
  for (const t of sorted) {
    if (Date.now() - start > budgetMs) break;
    t.run();
    ran.push(t.id);
  }
  return ran;
}
