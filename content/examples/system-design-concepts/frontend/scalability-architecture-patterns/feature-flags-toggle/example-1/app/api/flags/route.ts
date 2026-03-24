import { cookies } from "next/headers";
import { evaluateAllFlags } from "@/lib/flags";
import { readSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const session = readSession(cookieStore);
  const flags = evaluateAllFlags({ user: session.user });
  return Response.json({ user: session.user, flags });
}

