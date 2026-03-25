import { ticketSchema } from "../../../lib/schema";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ticketSchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  // In production: store in DB, enqueue work, add audit logs, etc.
  return Response.json({ ok: true, normalized: parsed.data });
}

