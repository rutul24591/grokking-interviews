import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email: string; password: string; rememberMe?: boolean };
  const validEmail = body.email === "owner@example.com";
  const validPassword = body.password === "CorrectHorseBatteryStaple";

  if (validEmail && validPassword) {
    return NextResponse.json({
      ok: true,
      requiresMfa: true,
      rememberMe: Boolean(body.rememberMe),
      message: "Primary credentials accepted. Continue to MFA and then redirect to the authenticated landing page."
    });
  }

  return NextResponse.json(
    {
      ok: false,
      requiresMfa: false,
      rememberMe: false,
      remainingAttempts: 2,
      message: "Login failed. Check the email or password."
    },
    { status: 401 }
  );
}
