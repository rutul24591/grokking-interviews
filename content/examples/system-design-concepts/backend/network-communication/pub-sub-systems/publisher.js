import { publish } from "./broker.js";

setInterval(() => {
  publish("orders", { id: Date.now(), status: "created" });
}, 1000);