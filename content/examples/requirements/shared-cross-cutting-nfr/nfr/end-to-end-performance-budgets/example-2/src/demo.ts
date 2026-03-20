import { allocate } from "./allocator";

console.log(
  allocate(500, [
    { name: "edge", weight: 1 },
    { name: "app", weight: 2 },
    { name: "db", weight: 3 },
  ]),
);

