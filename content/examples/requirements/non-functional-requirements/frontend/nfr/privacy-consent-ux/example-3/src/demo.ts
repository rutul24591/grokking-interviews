type ConsentV1 = { version: 1; analytics: boolean; marketing: boolean };
type ConsentV2 = { version: 2; purposes: { analytics: boolean; marketing: boolean; personalization: boolean } };

function migrate(v1: ConsentV1): ConsentV2 {
  return {
    version: 2,
    purposes: { analytics: v1.analytics, marketing: v1.marketing, personalization: false }
  };
}

const old: ConsentV1 = { version: 1, analytics: true, marketing: false };
const v2 = migrate(old);

console.log(
  JSON.stringify(
    {
      old,
      v2,
      note: [
        "Version consent state so you can evolve purposes over time.",
        "Persist “deny” decisions explicitly; absence of consent is not the same as “allow”.",
        "Treat consent as part of your API contract and cache key strategy."
      ]
    },
    null,
    2,
  ),
);

