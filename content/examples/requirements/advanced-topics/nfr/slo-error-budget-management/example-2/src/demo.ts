import { burnRate, evaluateMultiWindow } from "./burn";

const objective = 0.999; // 0.1% monthly error budget

const windows = {
  "5m": { total: 50_000, bad: 120 }, // incident spike
  "1h": { total: 600_000, bad: 1200 },
  "30m": { total: 300_000, bad: 250 },
  "6h": { total: 3_600_000, bad: 2200 },
};

const burn = {
  burn5m: burnRate({ ...windows["5m"], objective }),
  burn1h: burnRate({ ...windows["1h"], objective }),
  burn30m: burnRate({ ...windows["30m"], objective }),
  burn6h: burnRate({ ...windows["6h"], objective }),
};

const evald = evaluateMultiWindow(burn);

console.log(
  JSON.stringify(
    {
      objective,
      windows,
      burn,
      evaluation: evald,
      interpretation:
        "Fast/slow alerts fire only when both short+long windows exceed thresholds; this reduces noise and catches real incidents.",
    },
    null,
    2,
  ),
);

