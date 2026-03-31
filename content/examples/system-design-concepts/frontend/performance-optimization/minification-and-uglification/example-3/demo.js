const environments = [
  { name: "public-prod", stackTraceNeed: "high", publicExposureRisk: "high" },
  { name: "internal-staging", stackTraceNeed: "medium", publicExposureRisk: "low" },
  { name: "regulated-prod", stackTraceNeed: "high", publicExposureRisk: "medium" },
];

for (const environment of environments) {
  const policy =
    environment.publicExposureRisk === "high"
      ? "hidden-source-map"
      : environment.publicExposureRisk === "medium"
        ? "hidden-source-map + restricted map upload"
        : "source-map";
  console.log(`${environment.name} -> ${policy}`);
}
