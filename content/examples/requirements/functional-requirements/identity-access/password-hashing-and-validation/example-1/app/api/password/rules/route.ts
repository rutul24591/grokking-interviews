import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    minLength: 12,
    requireUpper: true,
    requireNumber: true,
    requireSymbol: true,
    algorithm: "argon2id",
    memoryCostKb: 65536,
    iterationCost: 3
  });
}
