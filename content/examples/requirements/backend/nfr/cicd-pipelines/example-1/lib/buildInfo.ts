export type BuildInfo = {
  gitSha: string;
  buildId: string;
  environment: "local" | "ci";
};

export function getBuildInfo(): BuildInfo {
  const gitSha = process.env.NEXT_PUBLIC_GIT_SHA || process.env.GITHUB_SHA || "dev";
  const buildId = process.env.NEXT_PUBLIC_BUILD_ID || process.env.GITHUB_RUN_ID || "local";
  const environment = process.env.CI ? "ci" : "local";
  return { gitSha, buildId, environment };
}

