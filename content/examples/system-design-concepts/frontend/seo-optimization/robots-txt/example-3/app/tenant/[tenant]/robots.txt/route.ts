import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { tenant: string } }) {
  const { tenant } = params;
  const disallow = tenant === "acme" ? "/tenant/acme/private" : "/tenant/*/private";

  const body = `User-agent: *\nAllow: /tenant/${tenant}/\nDisallow: ${disallow}\n`;
  return new NextResponse(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

