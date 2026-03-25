import { randomUUID } from "node:crypto";

export async function POST() {
  const secret = `tok_${randomUUID()}`;
  const secure = process.env.NODE_ENV === "production";

  const setCookie = [
    `__Host-demo=${secret}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=3600"
  ]
    .filter(Boolean)
    .join("; ");

  return Response.json(
    { ok: true, note: "Cookie set (HttpOnly). Client JS cannot read it." },
    { headers: { "Set-Cookie": setCookie } }
  );
}

