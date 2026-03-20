import { parseEvent } from "./bus";

console.log(parseEvent(1, { type: "navigate", to: "/settings" }));
console.log(parseEvent(2, { type: "navigate", to: "/profile", replace: true }));

