export function snap(n: number, grid: number) {
  return Math.round(n / grid) * grid;
}

export function snapRect(args: { x: number; y: number; w: number; h: number; grid: number }) {
  return {
    x: snap(args.x, args.grid),
    y: snap(args.y, args.grid),
    w: snap(args.w, args.grid),
    h: snap(args.h, args.grid),
  };
}
