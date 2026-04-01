import { NextRequest, NextResponse } from "next/server";
import { registrationState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    email: string;
    company: string;
    employeeCount: number;
  };
  registrationState.name = body.name;
  registrationState.email = body.email;
  registrationState.company = body.company;
  registrationState.submitted = true;
  registrationState.reviewRequired = body.employeeCount > 5000;
  registrationState.lastMessage = registrationState.reviewRequired
    ? `Queued ${body.company} for enterprise review.`
    : `Registration submitted for ${body.email}.`;
  return NextResponse.json(registrationState);
}
