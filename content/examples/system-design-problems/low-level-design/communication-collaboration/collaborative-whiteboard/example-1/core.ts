export type ShapeId = string;

export type Shape =
  | { kind: "rect"; id: ShapeId; x: number; y: number; w: number; h: number; color: string }
  | { kind: "path"; id: ShapeId; points: Array<{ x: number; y: number }>; color: string };

export type WhiteboardState = {
  version: number;
  shapes: Record<ShapeId, Shape>;
  order: ShapeId[];
};

export type Op =
  | { kind: "add"; shape: Shape }
  | { kind: "update"; id: ShapeId; patch: Partial<Shape> }
  | { kind: "remove"; id: ShapeId };

export function apply(state: WhiteboardState, op: Op): WhiteboardState {
  if (op.kind === "add") {
    return {
      ...state,
      version: state.version + 1,
      shapes: { ...state.shapes, [op.shape.id]: op.shape },
      order: [...state.order, op.shape.id],
    };
  }
  if (op.kind === "update") {
    const prev = state.shapes[op.id];
    if (!prev) return state;
    return {
      ...state,
      version: state.version + 1,
      shapes: { ...state.shapes, [op.id]: { ...prev, ...(op.patch as any) } },
    };
  }
  return {
    ...state,
    version: state.version + 1,
    shapes: Object.fromEntries(Object.entries(state.shapes).filter(([id]) => id !== op.id)),
    order: state.order.filter((id) => id !== op.id),
  };
}
