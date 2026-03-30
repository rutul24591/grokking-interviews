import { classifyResolution } from "./policy.js";
import { scenarios } from "./scenarios.js";

for (const scenario of scenarios) {
  const resolution = classifyResolution({
    local: scenario.local,
    incoming: scenario.incoming
  });

  console.log(`\n=== ${scenario.name} ===`);
  console.log(`Expectation: ${scenario.expected}`);
  console.log(
    JSON.stringify(
      {
        local: scenario.local,
        incoming: scenario.incoming,
        resolution
      },
      null,
      2
    )
  );
}
