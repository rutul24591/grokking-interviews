const deps = [
  { name: "next", version: "16.1.6", purl: "pkg:npm/next@16.1.6" },
  { name: "react", version: "19.2.3", purl: "pkg:npm/react@19.2.3" },
];

const sbom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  version: 1,
  metadata: { timestamp: new Date().toISOString(), component: { name: "demo-app", version: "0.1.0" } },
  components: deps.map((d) => ({ type: "library", name: d.name, version: d.version, purl: d.purl })),
};

console.log(JSON.stringify(sbom, null, 2));

