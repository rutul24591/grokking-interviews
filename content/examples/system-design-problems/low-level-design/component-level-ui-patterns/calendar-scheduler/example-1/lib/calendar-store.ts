import { create } from 'zustand';
import type { CalendarEvent, CalendarView, DragState, ModalState } from '../lib/calendar-types';

interface CalendarStore {
  currentView: CalendarView;
  activeDate: Date;
  events: CalendarEvent[];
  dragState: DragState;
  modalState: ModalState;

  // View actions
  setView: (view: CalendarView) => void;
  goPrev: () => void;
  goNext: () => void;
  goToday: () => void;
  selectDate: (date: Date) => void;

  // Event actions
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Drag actions
  startDrag: (event: CalendarEvent, mode: 'move' | 'resize') => void;
  updateDragPreview: (start: Date, end: Date) => void;
  endDrag: (success: boolean) => void;

  // Modal actions
  openModal: (start?: Date, end?: Date) => void;
  closeModal: () => void;
}

function navigateDate(date: Date, view: CalendarView, delta: number): Date {
  const next = new Date(date);
  switch (view) {
    case 'month':
      next.setMonth(next.getMonth() + delta);
      break;
    case 'week':
      next.setDate(next.getDate() + delta * 7);
      break;
    case 'day':
      next.setDate(next.getDate() + delta);
      break;
    case 'agenda':
      next.setDate(next.getDate() + delta * 7);
      break;
  }
  return next;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  currentView: 'month',
  activeDate: new Date(),
  events: [],
  dragState: {
    eventId: null,
    mode: null,
    previewStart: null,
    previewEnd: null,
    originalStart: null,
    originalEnd: null,
  },
  modalState: {
    isOpen: false,
    prefillStart: null,
    prefillEnd: null,
  },

  setView: (view) => set({ currentView: view }),

  goPrev: () =>
    set((state) => ({
      activeDate: navigateDate(state.activeDate, state.currentView, -1),
    })),

  goNext: () =>
    set((state) => ({
      activeDate: navigateDate(state.activeDate, state.currentView, 1),
    })),

  goToday: () => set({ activeDate: new Date() }),

  selectDate: (date) => set({ activeDate: date }),

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  startDrag: (event, mode) =>
    set({
      dragState: {
        eventId: event.id,
        mode,
        previewStart: event.start,
        previewEnd: event.end,
        originalStart: event.start,
        originalEnd: event.end,
      },
    }),

  updateDragPreview: (start, end) =>
    set((state) => ({
      dragState: {
        ...state.dragState,
        previewStart: start,
        previewEnd: end,
      },
    })),

  endDrag: (success) =>
    set((state) => {
      const { dragState, events } = state;
      if (!success || !dragState.eventId) {
        // Rollback
        if (dragState.eventId) {
          return {
            events: events.map((e) =>
              e.id === dragState.eventId
                ? { ...e, start: dragState.originalStart!, end: dragState.originalEnd! }
                : e
            ),
            dragState: {
              eventId: null,
              mode: null,
              previewStart: null,
              previewEnd: null,
              originalStart: null,
              originalEnd: null,
            },
          };
        }
        return {
          dragState: {
            eventId: null,
            mode: null,
            previewStart: null,
            previewEnd: null,
            originalStart: null,
            originalEnd: null,
          },
        };
      }
      // Commit
      return {
        events: events.map((e) =>
          e.id === dragState.eventId
            ? { ...e, start: dragState.previewStart!, end: dragState.previewEnd! }
            : e
        ),
        dragState: {
          eventId: null,
          mode: null,
          previewStart: null,
          previewEnd: null,
          originalStart: null,
          originalEnd: null,
        },
      };
    }),

  openModal: (start, end) =>
    set({
      modalState: {
        isOpen: true,
        prefillStart: start ?? null,
        prefillEnd: end ?? null,
      },
    }),

  closeModal: () =>
    set({
      modalState: {
        isOpen: false,
        prefillStart: null,
        prefillEnd: null,
      },
    }),
}));

// Selectors for fine-grained subscriptions
export const selectCurrentView = (state: CalendarStore) => state.currentView;
export const selectActiveDate = (state: CalendarStore) => state.activeDate;
export const selectEvents = (state: CalendarStore) => state.events;
export const selectDragState = (state: CalendarStore) => state.dragState;
export const selectModalState = (state: CalendarStore) => state.modalState;
