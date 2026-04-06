import { useMemo } from 'react';
import { useCalendarStore, selectEvents } from '../lib/calendar-store';
import { expandAllRecurringEvents } from '../lib/recurring-event-expander';
import { detectCollisionsByDay } from '../lib/event-collision-detector';
import type { DateRange } from '../hooks/use-calendar-navigation';

/**
 * Memoized hook that filters events by visible date range, expands recurring
 * events into occurrences, and runs collision detection.
 *
 * Recomputes only when the event array or date range changes.
 */
export function useCalendarEvents(dateRange: DateRange) {
  const events = useCalendarStore(selectEvents);

  const occurrences = useMemo(() => {
    // Expand recurring events and filter single events
    const expanded = expandAllRecurringEvents(
      events,
      dateRange.start,
      dateRange.end
    );

    // Run collision detection grouped by day
    const collisionMap = detectCollisionsByDay(expanded);

    // Enrich each occurrence with collision data
    return expanded.map((event) => {
      const dateKey = event.start.toDateString();
      const collisionGroup = collisionMap.get(dateKey);
      const columnIndex = collisionGroup?.columnAssignments.get(event.id) ?? 0;
      const totalColumns = collisionGroup?.totalColumns ?? 1;

      return {
        ...event,
        columnIndex,
        totalColumns,
      };
    });
  }, [events, dateRange.start.getTime(), dateRange.end.getTime()]);

  return occurrences;
}
