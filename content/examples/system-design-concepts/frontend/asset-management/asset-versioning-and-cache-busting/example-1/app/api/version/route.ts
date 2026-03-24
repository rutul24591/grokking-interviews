import { NextResponse } from "next/server";
import { z } from "zod";

const EnvSchema = z.object({
  APP_VERSION: z.string().optional(),
});

export async function GET() {
  const env = EnvSchema.parse(process.env);
  return NextResponse.json({
    appVersion: env.APP_VERSION ?? "dev",
    generatedAt: new Date().toISOString(),
  });
}

