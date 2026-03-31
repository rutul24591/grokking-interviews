const source = `
import _ from "lodash";
import { formatDate } from "./format-date";
import { debounce } from "lodash-es";
import * as icons from "@heroicons/react/24/outline";
`;

const rules = [
  {
    name: "avoid namespace imports from icon packs",
    test: (line) => line.includes("* as") && line.includes("@heroicons"),
    remediation: 'Import only the icon components you render.',
  },
  {
    name: "avoid broad CommonJS utility imports",
    test: (line) => line.includes('import _ from "lodash"'),
    remediation: 'Switch to `lodash-es` or a local utility for the single function you need.',
  },
];

const lines = source.trim().split("\n");

for (const line of lines) {
  const issue = rules.find((rule) => rule.test(line));
  console.log(`\n${line.trim()}`);
  if (!issue) {
    console.log("status: ok");
    continue;
  }

  console.log(`status: fail -> ${issue.name}`);
  console.log(`fix: ${issue.remediation}`);
}
