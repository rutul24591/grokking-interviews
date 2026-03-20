import { z } from "zod";

export const FindingSchema = z.object({
  ruleId: z.string(),
  message: z.string(),
  target: z.array(z.string()),
  helpUrl: z.string().optional(),
});

export type Finding = z.infer<typeof FindingSchema>;

export function toSarif(params: { toolName: string; findings: Finding[] }) {
  return {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: params.toolName,
            rules: [...new Set(params.findings.map((f) => f.ruleId))].map((ruleId) => ({
              id: ruleId,
            })),
          },
        },
        results: params.findings.map((f) => ({
          ruleId: f.ruleId,
          level: "warning",
          message: { text: f.message },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: "ui.html" },
                region: { startLine: 1, startColumn: 1 },
              },
              logicalLocations: [
                { fullyQualifiedName: f.target.join(" ") },
              ],
            },
          ],
          helpUri: f.helpUrl,
        })),
      },
    ],
  };
}

