/**
 * Dashboard Builder — Edge Case: Layout Collision Resolution.
 *
 * When a widget is resized or moved, it may overlap with other widgets.
 * The layout engine must resolve collisions by shifting overlapping widgets.
 */

export interface Widget {
  id: string;
  x: number; // Column position (0-11 for 12-column grid)
  y: number; // Row position
  w: number; // Width in columns
  h: number; // Height in rows
}

/**
 * Resolves layout collisions when a widget is moved or resized.
 * Uses a push-down strategy: overlapping widgets are shifted downward.
 */
export function resolveCollisions(
  widgets: Widget[],
  movedWidget: Widget,
): Widget[] {
  const result = widgets.map((w) => ({ ...w }));
  const movedIndex = result.findIndex((w) => w.id === movedWidget.id);
  if (movedIndex === -1) return result;

  result[movedIndex] = { ...movedWidget };
  const moved = result[movedIndex];

  // Check for overlaps with all other widgets
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < result.length; i++) {
      if (i === movedIndex) continue;

      const other = result[i];
      if (isOverlapping(moved, other)) {
        // Push the other widget down
        other.y = moved.y + moved.h;
        changed = true;
      }
    }
  }

  return result;
}

/**
 * Checks if two widgets overlap.
 */
function isOverlapping(a: Widget, b: Widget): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Compacts the layout by moving all widgets up as far as possible.
 */
export function compactLayout(widgets: Widget[], columns: number): Widget[] {
  const sorted = [...widgets].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  const occupied = new Set<string>();

  for (const widget of sorted) {
    let newY = widget.y;

    // Try to move widget up
    while (newY > 0) {
      const wouldOverlap = wouldWidgetOverlap(widget, { ...widget, y: newY - 1 }, occupied, columns);
      if (wouldOverlap) break;
      newY--;
    }

    widget.y = newY;

    // Mark occupied cells
    for (let row = widget.y; row < widget.y + widget.h; row++) {
      for (let col = widget.x; col < widget.x + widget.w; col++) {
        occupied.add(`${row},${col}`);
      }
    }
  }

  return sorted;
}

function wouldWidgetOverlap(
  original: Widget,
  proposed: Widget,
  occupied: Set<string>,
  columns: number,
): boolean {
  for (let row = proposed.y; row < proposed.y + proposed.h; row++) {
    for (let col = proposed.x; col < proposed.x + proposed.w; col++) {
      const key = `${row},${col}`;
      // Check if this cell is occupied by a DIFFERENT widget
      if (occupied.has(key)) {
        // Check if it's occupied by the original widget itself
        const origOccupies = row >= original.y && row < original.y + original.h &&
          col >= original.x && col < original.x + original.w;
        if (!origOccupies) return true;
      }
    }
  }
  return false;
}
