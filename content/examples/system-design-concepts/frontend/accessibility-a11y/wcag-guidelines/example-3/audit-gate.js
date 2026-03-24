import fs from "node:fs";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function countBySeverity(findings) {
  let errors = 0;
  let warnings = 0;
  for (const f of findings) {
    if (f.severity === "error") errors++;
    else if (f.severity === "warn") warnings++;
  }
  return { errors, warnings };
}

function main() {
  const policy = readJson("./policy.json");
  const report = readJson("./audit-results.json");
  const { errors, warnings } = countBySeverity(report.findings ?? []);

  console.log("a11y gate");
  console.log(`- errors: ${errors} (max ${policy.maxErrors})`);
  console.log(`- warnings: ${warnings} (max ${policy.maxWarnings})`);

  if (errors > policy.maxErrors || warnings > policy.maxWarnings) {
    console.error("FAIL: accessibility budget exceeded.");
    process.exitCode = 1;
    return;
  }

  console.log("PASS: accessibility budget within limits.");
}

main();

