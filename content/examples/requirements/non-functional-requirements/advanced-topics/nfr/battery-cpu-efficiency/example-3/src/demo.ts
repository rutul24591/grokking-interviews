import { gate } from "./budget";

const durations = [10, 20, 55, 80, 45, 120, 30, 60];
const report = gate({ durationsMs: durations, maxCount: 10, maxP95Ms: 100 });
console.log(report);

if (!report.ok) process.exit(1);

