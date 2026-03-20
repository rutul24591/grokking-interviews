import { Histogram } from "./hist";

const h = new Histogram(0, 1000, 50);
for (let i = 0; i < 1000; i++) h.add(Math.random() * 400);
for (let i = 0; i < 50; i++) h.add(900 + Math.random() * 100); // tail

console.log({ p50: h.percentile(0.5), p95: h.percentile(0.95) });

