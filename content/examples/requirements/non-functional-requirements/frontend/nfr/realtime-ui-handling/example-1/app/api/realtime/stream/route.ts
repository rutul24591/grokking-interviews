import { z } from "zod";
import { snapshot, subscribe } from "@/lib/realtime";

export const runtime = "nodejs";

const QuerySchema = z.object({ cursor: z.coerce.number().int().min(0).default(0) });

function sse(data: unknown, id?: string) {
  const lines = [];
  if (id) lines.push(`id: ${id}`);
  lines.push(`data: ${JSON.stringify(data)}`);
  return lines.join("\n") + "\n\n";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  const startCursor = q.success ? q.data.cursor : 0;

  const encoder = new TextEncoder();
  let unsub: (() => void) | null = null;
  let keepAlive: number | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(": connected\n\n"));

      const snap = snapshot(startCursor);
      for (const m of snap.messages) {
        controller.enqueue(encoder.encode(sse(m, String(m.cursor))));
      }

      unsub = subscribe((m) => {
        controller.enqueue(encoder.encode(sse(m, String(m.cursor))));
      });

      keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 12_000) as unknown as number;
    },
    cancel() {
      unsub?.();
      if (keepAlive) clearInterval(keepAlive);
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive"
    }
  });
}

