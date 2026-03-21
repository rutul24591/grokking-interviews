import { z } from "zod";

export type TraceContext = {
  traceId: string;
  parentSpanId: string | null;
  sampled: boolean;
};

const TraceparentSchema = z
  .string()
  .regex(/^[\da-f]{2}-[\da-f]{32}-[\da-f]{16}-[\da-f]{2}$/i);

export function parseTraceparent(header: string | null): TraceContext | null {
  if (!header) return null;
  if (!TraceparentSchema.safeParse(header.trim()).success) return null;
  const [version, traceId, parentId, flags] = header.trim().split("-");
  if (version !== "00") return null;
  return {
    traceId: traceId.toLowerCase(),
    parentSpanId: parentId.toLowerCase(),
    sampled: (parseInt(flags, 16) & 0x1) === 1,
  };
}

export function formatTraceparent(params: {
  traceId: string;
  spanId: string;
  sampled: boolean;
}): string {
  const flags = params.sampled ? "01" : "00";
  return `00-${params.traceId}-${params.spanId}-${flags}`;
}

