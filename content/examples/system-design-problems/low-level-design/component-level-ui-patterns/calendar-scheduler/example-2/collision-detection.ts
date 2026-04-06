/**
 * Calendar Collision Detection — Handles overlapping event rendering.
 *
 * Interview edge case: Multiple events in the same time slot must render
 * side-by-side without overlapping. The collision algorithm groups overlapping
 * events and assigns column positions.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export interface CollisionGroup {
  events: CalendarEvent[];
  column: number;
  totalColumns: number;
}

/**
 * Checks if two events overlap in time.
 */
function eventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Groups events by collision and assigns column positions.
 * Uses a greedy algorithm: for each event, find the first available column
 * where it doesn't overlap with already-placed events.
 */
export function detectCollisions(events: CalendarEvent[]): CollisionGroup[] {
  if (events.length === 0) return [];

  // Sort by start time, then by duration (longer events first)
  const sorted = [...events].sort((a, b) => {
    const timeDiff = a.start.getTime() - b.start.getTime();
    if (timeDiff !== 0) return timeDiff;
    return b.end.getTime() - b.start.getTime() - (a.end.getTime() - a.start.getTime());
  });

  const columns: CalendarEvent[][] = [];

  for (const event of sorted) {
    let placed = false;
    for (let col = 0; col < columns.length; col++) {
      const hasConflict = columns[col].some((existing) => eventsOverlap(existing, event));
      if (!hasConflict) {
        columns[col].push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
  }

  // Build collision groups
  const result: CollisionGroup[] = [];
  const totalCols = columns.length;

  for (let col = 0; col < totalCols; col++) {
    for (const event of columns[col]) {
      // Find which other columns this event conflicts with
      const conflictingCols = new Set<number>();
      conflictingCols.add(col);
      for (let otherCol = 0; otherCol < totalCols; otherCol++) {
        if (otherCol === col) continue;
        if (columns[otherCol].some((e) => eventsOverlap(e, event))) {
          conflictingCols.add(otherCol);
        }
      }
      result.push({ events: [event], column: col, totalColumns: conflictingCols.size });
    }
  }

  return result;
}
