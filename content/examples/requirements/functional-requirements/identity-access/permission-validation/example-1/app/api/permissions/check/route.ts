import { NextRequest, NextResponse } from "next/server";
import { approvalOverrides, permissionMap } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { role: string; action: string; resource: string };
  const key = `${body.role}:${body.action}`;
  const overrideKey = `${body.role}:${body.action}:${body.resource}` as keyof typeof approvalOverrides;
  const allowed = Boolean(permissionMap[key as keyof typeof permissionMap]);
  const override = approvalOverrides[overrideKey];

  return NextResponse.json({
    key,
    allowed,
    resource: body.resource,
    override: override ?? null,
    reason: override
      ? `Permission is conditionally allowed and requires ${override}.`
      : allowed
        ? "Permission granted."
        : "Permission denied."
  });
}
