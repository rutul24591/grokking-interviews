import { threeWayMerge } from "./merge.js";

const scenarios = [
  {
    name: "non-overlapping-fields",
    ancestor: { title: "Draft", body: "Hello", tags: ["offline"] },
    local: { title: "Draft v2", body: "Hello", tags: ["offline"] },
    server: { title: "Draft", body: "Hello world", tags: ["offline"] }
  },
  {
    name: "same-field-different-values",
    ancestor: { title: "Draft", body: "Hello", tags: ["offline"] },
    local: { title: "Mobile draft", body: "Hello", tags: ["offline"] },
    server: { title: "Server draft", body: "Hello", tags: ["offline"] }
  },
  {
    name: "same-edit-both-sides",
    ancestor: { title: "Draft", body: "Hello", tags: ["offline"] },
    local: { title: "Draft", body: "Hello world", tags: ["offline"] },
    server: { title: "Draft", body: "Hello world", tags: ["offline"] }
  }
];

for (const scenario of scenarios) {
  const result = threeWayMerge(scenario.ancestor, scenario.local, scenario.server);
  console.log(`\n=== ${scenario.name}`);
  console.log(JSON.stringify(result, null, 2));
}

