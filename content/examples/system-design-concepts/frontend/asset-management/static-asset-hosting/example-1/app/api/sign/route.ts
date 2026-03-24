import { NextResponse } from "next/server";
import { z } from "zod";
import { getEnv } from "@/lib/env";
import { sign } from "@/lib/signing";

const QuerySchema = z.object({
  name: z.string().min(1),
});

export async function GET(request: Request) {
  const env = getEnv();
  const u = new URL(request.url);
  const { name } = QuerySchema.parse({ name: u.searchParams.get("name") });

  const expires = Date.now() + 60_000;
  const pathOnly = `/private/${name}`;
  const token = sign({ method: "GET", path: pathOnly, expires, secret: env.ASSET_SIGNING_SECRET });

  return NextResponse.json({
    url: `${env.ASSET_ORIGIN}${pathOnly}?expires=${expires}&token=${token}`,
    expires,
  });
}

