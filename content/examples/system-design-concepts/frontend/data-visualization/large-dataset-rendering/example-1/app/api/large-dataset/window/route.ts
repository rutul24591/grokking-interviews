import { NextRequest, NextResponse } from "next/server";
import { datasetState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { viewportWidth: number };
  datasetState.viewportWidth = body.viewportWidth;
  datasetState.estimatedFrameMs = body.viewportWidth <= 480 ? 12 : body.viewportWidth <= 900 ? 16 : 22;
  datasetState.activeWindow = body.viewportWidth <= 480 ? "0-10k" : body.viewportWidth <= 900 ? "10k-20k" : "20k-30k";
  datasetState.lastMessage = `Adjusted the slice strategy for a ${body.viewportWidth}px viewport so the chart only renders data the screen can express.`;
  return NextResponse.json(datasetState);
}
