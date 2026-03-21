import { fingerprint } from "./fingerprint";

console.log(
  fingerprint({ service: "api", region: "us-east-1", symptom: "5xx" }),
  fingerprint({ symptom: "5xx", region: "us-east-1", service: "api" }),
);

