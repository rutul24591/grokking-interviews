import type { CalendarEvent, CollisionGroup } from '../lib/calendar-types';

const MAX_COLUMNS = 4;

interface EventWithColumn {
  event: CalendarEvent;
  columnIndex: number;
}

/**
 * Detects overlapping events within a single day and assigns them to columns
 * for side-by-side rendering.
 *
 * Algorithm: Sweep-line approach
 * 1. Sort events by start time (then by duration descending for ties)
 * 2. Maintain an array of column end times
 * 3. For each event, find the first column where the event doesn't overlap
 *    with the column's last event. If none exists and max columns not reached,
 *    create a new column. Otherwise, assign to last column.
 *
 * Time complexity: O(n log n) for sorting + O(n * k) for column assignment
 * where k is max columns (typically 4).
 */
export function detectCollisions(events: CalendarEvent[]): CollisionGroup {
  if (events.length === 0) {
    return { events: [], columnAssignments: new Map(), totalColumns: 0 };
  }

  // Sort by start time, then by duration descending (longer events get priority columns)
  const sorted = [...events].sort((a, b) => {
    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;
    const durationA = a.end.getTime() - a.start.getTime();
    const durationB = b.end.getTime() - b.start.getTime();
    return durationB - durationA;
  });

  const columnEndTimes: number[] = []; // end timestamp of last event in each column
  const assignments: EventWithColumn[] = [];

  for (const event of sorted) {
    const eventStart = event.start.getTime();
    let assignedColumn = -1;

    // Find first column where this event doesn't overlap
    for (let col = 0; col < columnEndTimes.length; col++) {
      if (eventStart >= columnEndTimes[col]) {
        assignedColumn = col;
        break;
      }
    }

    // If no column found, create new one (up to MAX_COLUMNS)
    if (assignedColumn === -1) {
      if (columnEndTimes.length < MAX_COLUMNS) {
        assignedColumn = columnEndTimes.length;
        columnEndTimes.push(0);
      } else {
        // Cap at MAX_COLUMNS, assign to the column with earliest end time
        let earliestEnd = Infinity;
        for (let col = 0; col < columnEndTimes.length; col++) {
          if (columnEndTimes[col] < earliestEnd) {
            earliestEnd = columnEndTimes[col];
            assignedColumn = col;
          }
        }
      }
    }

    columnEndTimes[assignedColumn] = event.end.getTime();
    assignments.push({ event, columnIndex: assignedColumn });
  }

  // Build result
  const columnAssignments = new Map<string, number>();
  for (const { event, columnIndex } of assignments) {
    columnAssignments.set(event.id, columnIndex);
  }

  return {
    events: sorted,
    columnAssignments,
    totalColumns: Math.min(columnEndTimes.length, MAX_COLUMNS),
  };
}

/**
 * Groups events by date and runs collision detection per day.
 * Returns a Map of date string to CollisionGroup.
 */
export function detectCollisionsByDay(
  events: CalendarEvent[]
): Map<string, CollisionGroup> {
  const byDay = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const dateKey = event.start.toDateString();
    if (!byDay.has(dateKey)) {
      byDay.set(dateKey, []);
    }
    byDay.get(dateKey)!.push(event);
  }

  const result = new Map<string, CollisionGroup>();
  for (const [dateKey, dayEvents] of byDay) {
    result.set(dateKey, detectCollisions(dayEvents));
  }

  return result;
}
