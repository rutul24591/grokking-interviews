import type { FieldSchema, FieldId } from "./schema";

export type RenderContext = {
  values: Record<FieldId, unknown>;
  errors: Record<FieldId, string[]>;
  onChange: (id: FieldId, value: unknown) => void;
};

export type FieldRenderer = (field: FieldSchema, ctx: RenderContext) => JSX.Element;

// Interview note: keeping rendering as an injected contract is a big win.
// The builder can run on web, mobile, or server-side previews by swapping renderers.

