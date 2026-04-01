import { NextRequest, NextResponse } from "next/server";
import { featureState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; supported: boolean };
  featureState.features = featureState.features.map((feature) =>
    feature.id === body.id ? { ...feature, supported: body.supported } : feature
  );
  const missingRequired = featureState.features.filter((feature) => feature.required && !feature.supported);
  featureState.lastMessage =
    missingRequired.length > 0
      ? `Required capability gap for ${missingRequired.map((feature) => feature.label).join(", ")}. Fall back to the compatible navigation path.`
      : `Updated capability check for ${body.id}. Optional features now follow the runtime support matrix.`;
  return NextResponse.json(featureState);
}
