import { useMemo } from 'react';
import { useCalendarStore, selectCurrentView, selectActiveDate } from '../lib/calendar-store';

interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Hook that computes the visible date range for the current view type
 * and provides navigation actions (prev/next/today).
 */
export function useCalendarNavigation(): {
  dateRange: DateRange;
  goPrev: () => void;
  goNext: () => void;
  goToday: () => void;
  selectDate: (date: Date) => void;
  currentView: ReturnType<typeof selectCurrentView>;
  activeDate: ReturnType<typeof selectActiveDate>;
} {
  const currentView = useCalendarStore(selectCurrentView);
  const activeDate = useCalendarStore(selectActiveDate);
  const goPrev = useCalendarStore((state) => state.goPrev);
  const goNext = useCalendarStore((state) => state.goNext);
  const goToday = useCalendarStore((state) => state.goToday);
  const selectDate = useCalendarStore((state) => state.selectDate);

  const dateRange = useMemo(() => {
    return computeDateRange(activeDate, currentView);
  }, [activeDate, currentView]);

  return { dateRange, goPrev, goNext, goToday, selectDate, currentView, activeDate };
}

/**
 * Computes the visible date range (start, end) for a given view type and reference date.
 */
function computeDateRange(referenceDate: Date, view: string): DateRange {
  const date = new Date(referenceDate);
  const start = new Date(date);
  const end = new Date(date);

  switch (view) {
    case 'month': {
      // First day of the week containing the 1st of the month
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const dayOfWeek = firstOfMonth.getDay(); // 0 = Sunday
      start.setDate(firstOfMonth.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);

      // Last day of the week containing the last day of the month
      const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const lastDayOfWeek = lastOfMonth.getDay();
      end.setDate(lastOfMonth.getDate() + (6 - lastDayOfWeek));
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'week': {
      // Monday through Sunday of the active week
      const dayOfWeek = date.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      start.setDate(date.getDate() - daysFromMonday);
      start.setHours(0, 0, 0, 0);

      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'day': {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'agenda': {
      // 4-week window starting from the active date
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 27);
      end.setHours(23, 59, 59, 999);
      break;
    }
  }

  return { start, end };
}

/**
 * Hook for the mini calendar: returns the days of the month containing the
 * given date, for rendering the mini calendar grid.
 */
export function useMiniCalendarDays(date: Date): Date[] {
  return useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const daysFromSunday = firstOfMonth.getDay();
    const startDate = new Date(firstOfMonth);
    startDate.setDate(startDate.getDate() - daysFromSunday);

    const endDate = new Date(lastOfMonth);
    const daysToSaturday = 6 - lastOfMonth.getDay();
    endDate.setDate(endDate.getDate() + daysToSaturday);

    const days: Date[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [date]);
}
