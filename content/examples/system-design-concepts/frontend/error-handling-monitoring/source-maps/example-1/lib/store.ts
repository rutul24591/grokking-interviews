export type BuildArtifact = {
  id: string;
  asset: string;
  sourceMaps: "private" | "public" | "disabled";
  release: string;
  uploadedToErrorTool: boolean;
  containsSensitivePaths: boolean;
};
export const sourceMapState = {
  artifacts: [
    {
      id: "s1",
      asset: "main.js",
      sourceMaps: "private" as const,
      release: "2026.04.01",
      uploadedToErrorTool: true,
      containsSensitivePaths: true
    },
    {
      id: "s2",
      asset: "vendors.js",
      sourceMaps: "disabled" as const,
      release: "2026.04.01",
      uploadedToErrorTool: false,
      containsSensitivePaths: false
    }
  ],
  deploymentSurface: "public-cdn",
  lastMessage: "Source maps should support debugging without leaking internals publicly."
};
