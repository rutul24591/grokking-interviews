export type Rect = { x: number; y: number; w: number; h: number };

// Map viewport rect in world coords to minimap coords.
export function toMinimapRect(args: {
  world: Rect;
  view: Rect;
  minimap: Rect;
}) {
  const { world, view, minimap } = args;
  const sx = minimap.w / world.w;
  const sy = minimap.h / world.h;
  return {
    x: minimap.x + (view.x - world.x) * sx,
    y: minimap.y + (view.y - world.y) * sy,
    w: view.w * sx,
    h: view.h * sy,
  };
}
