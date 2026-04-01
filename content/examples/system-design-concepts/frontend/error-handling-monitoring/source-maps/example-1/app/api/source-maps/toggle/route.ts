import { NextRequest, NextResponse } from "next/server";
import { sourceMapState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; sourceMaps: "private" | "public" | "disabled" };
  sourceMapState.artifacts = sourceMapState.artifacts.map((artifact) =>
    artifact.id === body.id
      ? {
          ...artifact,
          sourceMaps: body.sourceMaps,
          uploadedToErrorTool: body.sourceMaps === "private" ? true : artifact.uploadedToErrorTool
        }
      : artifact
  );
  const publicSensitive = sourceMapState.artifacts.filter(
    (artifact) => artifact.sourceMaps === "public" && artifact.containsSensitivePaths
  );
  sourceMapState.lastMessage =
    publicSensitive.length > 0
      ? `Public source maps expose sensitive paths for ${publicSensitive.map((artifact) => artifact.asset).join(", ")}. Move them to private uploads.`
      : `Updated source map policy for ${body.id} to ${body.sourceMaps}.`;
  return NextResponse.json(sourceMapState);
}
