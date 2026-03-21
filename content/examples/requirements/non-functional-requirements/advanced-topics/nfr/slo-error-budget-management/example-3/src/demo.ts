import * as fs from "fs";
import * as path from "path";
import { decideRelease, type SloReport } from "./gate";

const reportPath = path.join(process.cwd(), "src", "sample-report.json");
const report = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as SloReport;

const decision = decideRelease({
  report,
  minRemainingPct: 0.2,
  requireTraffic: true,
});

console.log(
  JSON.stringify(
    {
      report,
      decision,
      interpretation:
        "This shape is intended for CI/CD: fail the pipeline when allowed=false, and include remediation in the logs.",
    },
    null,
    2,
  ),
);

