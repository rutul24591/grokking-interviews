import { cookies } from "next/headers";

export async function GET() {
  const v = (await cookies()).get("__Host-demo")?.value ?? null;
  return Response.json({
    present: Boolean(v),
    preview: v ? `${v.slice(0, 8)}…` : null
  });
}

