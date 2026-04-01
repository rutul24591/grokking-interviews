import { NextRequest, NextResponse } from "next/server";
import { rotation } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { service?: string };

  if (body.service) {
    rotation.consumers = rotation.consumers.map((consumer) =>
      consumer.service === body.service ? { ...consumer, updated: true } : consumer
    );
    rotation.consumersUpdated = rotation.consumers.every((consumer) => consumer.updated);
    rotation.status = rotation.consumersUpdated ? "stable" : "rotated-awaiting-consumers";
    rotation.lastMessage = `Marked ${body.service} as updated to version ${rotation.activeVersion}.`;
    return NextResponse.json(rotation);
  }

  rotation.activeVersion += 1;
  rotation.rotatedAt = new Date().toISOString();
  rotation.status = "rotated-awaiting-consumers";
  rotation.consumersUpdated = false;
  rotation.consumers = rotation.consumers.map((consumer) => ({ ...consumer, updated: false }));
  rotation.lastMessage = `Rotated credential to version ${rotation.activeVersion}.`;
  return NextResponse.json(rotation);
}
