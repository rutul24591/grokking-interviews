import fetch from "node-fetch";
import { setHealthy } from "./health-state.js";

const targets = ["http://localhost:5001/health", "http://localhost:5002/health"];

async function probe(url) {
  try {
    const res = await fetch(url);
    setHealthy(url.replace("/health", ""), res.status === 200);
  } catch (err) {
    setHealthy(url.replace("/health", ""), false);
  }
}

setInterval(() => {
  targets.forEach((t) => probe(t));
}, 2000);