export type DayCell = {
  isoDate: string; // YYYY-MM-DD
  inMonth: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function buildMonthGrid(args: { year: number; month0: number; weekStartsOn0?: number }) {
  const { year, month0, weekStartsOn0 = 0 } = args;
  const first = new Date(year, month0, 1);
  const last = new Date(year, month0 + 1, 0);

  const startDow = (first.getDay() - weekStartsOn0 + 7) % 7;
  const totalDays = last.getDate();

  const cells: DayCell[] = [];

  // leading days from previous month
  const prevLast = new Date(year, month0, 0).getDate();
  for (let i = startDow - 1; i >= 0; i -= 1) {
    const d = new Date(year, month0 - 1, prevLast - i);
    cells.push({ isoDate: toIsoDate(d), inMonth: false });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const d = new Date(year, month0, day);
    cells.push({ isoDate: toIsoDate(d), inMonth: true });
  }

  // trailing days to complete weeks (6 rows max typical)
  while (cells.length % 7 !== 0) {
    const lastCell = cells[cells.length - 1];
    const [y, m, dd] = lastCell.isoDate.split("-").map(Number);
    const d = new Date(y, m - 1, dd + 1);
    cells.push({ isoDate: toIsoDate(d), inMonth: false });
  }

  return cells;
}

