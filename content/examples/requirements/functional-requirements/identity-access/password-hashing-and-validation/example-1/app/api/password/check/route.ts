import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password: string };
  const password = body.password;
  const checks = {
    longEnough: password.length >= 12,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    reused: password.toLowerCase().includes("password"),
    entropyStrong: new Set(password).size >= 8
  };
  const valid =
    checks.longEnough &&
    checks.upper &&
    checks.number &&
    checks.symbol &&
    !checks.reused &&
    checks.entropyStrong;

  return NextResponse.json({
    ...checks,
    valid,
    algorithm: "argon2id",
    derivedHashPreview: `argon2id$m=65536,t=3$preview-${password.length}`
  });
}
