import { useEffect, useRef, useCallback } from 'react';
import { useCalendarStore, selectDragState } from '../lib/calendar-store';
import { snapToGrid } from '../lib/time-slot-utils';
import type { CalendarEvent } from '../lib/calendar-types';

const SNAP_GRANULARITY = 30; // 30-minute grid
const SLOT_HEIGHT_PX = 48; // pixels per 30-min slot

/**
 * Hook that handles drag-to-move and drag-to-resize interactions for calendar events.
 *
 * Uses useRef for drag preview state to avoid re-renders on every mousemove.
 * Only commits to Zustand store on mouseup.
 */
export function useEventDrag(event: CalendarEvent, containerRef: React.RefObject<HTMLElement | null>) {
  const dragState = useCalendarStore(selectDragState);
  const startDrag = useCalendarStore((state) => state.startDrag);
  const updateDragPreview = useCalendarStore((state) => state.updateDragPreview);
  const endDrag = useCalendarStore((state) => state.endDrag);

  const isDragging = dragState.eventId === event.id;
  const previewRef = useRef<{ start: Date; end: Date } | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, mode: 'move' | 'resize') => {
      if (e.button !== 0) return; // Only left click
      e.preventDefault();
      e.stopPropagation();

      startDrag(event, mode);

      previewRef.current = {
        start: new Date(event.start),
        end: new Date(event.end),
      };

      const startY = e.clientY;
      const originalStart = new Date(event.start);
      const originalEnd = new Date(event.end);
      const duration = originalEnd.getTime() - originalStart.getTime();

      const handleMouseMove = (e: MouseEvent) => {
        if (!previewRef.current) return;

        // Cancel pending animation frame
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const deltaY = e.clientY - startY;
          const deltaSlots = Math.round(deltaY / SLOT_HEIGHT_PX);
          const deltaMs = deltaSlots * SNAP_GRANULARITY * 60 * 1000;

          if (mode === 'move') {
            const newStart = new Date(originalStart.getTime() + deltaMs);
            const newEnd = new Date(originalEnd.getTime() + deltaMs);

            const snappedStart = snapToGrid(newStart, SNAP_GRANULARITY);
            const snappedEnd = new Date(snappedStart.getTime() + duration);

            previewRef.current = { start: snappedStart, end: snappedEnd };
            updateDragPreview(snappedStart, snappedEnd);
          } else {
            // Resize mode: adjust end time only
            const newEnd = new Date(originalEnd.getTime() + deltaMs);
            const snappedEnd = snapToGrid(newEnd, SNAP_GRANULARITY);

            // Ensure minimum duration of 15 minutes
            const minEnd = new Date(previewRef.current.start.getTime() + 15 * 60 * 1000);
            const finalEnd = snappedEnd < minEnd ? minEnd : snappedEnd;

            previewRef.current = { ...previewRef.current, end: finalEnd };
            updateDragPreview(previewRef.current.start, finalEnd);
          }
        });
      };

      const handleMouseUp = () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Commit the drag operation (success assumed; rollback handled by store on API failure)
        endDrag(true);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [event, startDrag, updateDragPreview, endDrag]
  );

  // Handle Escape key to cancel drag
  useEffect(() => {
    if (!isDragging) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        endDrag(false); // false triggers rollback
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDragging, endDrag]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isDragging,
    previewStart: dragState.eventId === event.id ? dragState.previewStart : null,
    previewEnd: dragState.eventId === event.id ? dragState.previewEnd : null,
    onMoveMouseDown: (e: React.MouseEvent) => handleMouseDown(e, 'move'),
    onResizeMouseDown: (e: React.MouseEvent) => handleMouseDown(e, 'resize'),
  };
}
