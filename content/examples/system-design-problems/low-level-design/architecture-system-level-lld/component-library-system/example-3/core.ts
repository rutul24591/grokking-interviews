export interface AdoptionSample { app: string; version: string; deprecatedImports: number; bundleBytes: number; }
export interface AdoptionReport { activeMajors: string[]; laggingApps: string[]; bundleRegressionApps: string[]; deprecatedImportCount: number; }
export function analyzeAdoption(samples: AdoptionSample[], latestMajor: string, byteBudget: number): AdoptionReport {
  const activeMajors = [...new Set(samples.map((sample) => sample.version.split(".")[0]))].sort();
  const laggingApps = samples.filter((sample) => sample.version.split(".")[0] !== latestMajor).map((sample) => sample.app);
  const bundleRegressionApps = samples.filter((sample) => sample.bundleBytes > byteBudget).map((sample) => sample.app);
  const deprecatedImportCount = samples.reduce((sum, sample) => sum + sample.deprecatedImports, 0);
  return { activeMajors, laggingApps, bundleRegressionApps, deprecatedImportCount };
}
export function runAdoptionScenario() {
  return analyzeAdoption([
    { app: "admin", version: "3.2.0", deprecatedImports: 0, bundleBytes: 43000 },
    { app: "checkout", version: "2.8.1", deprecatedImports: 4, bundleBytes: 79000 },
  ], "3", 60000);
}
