import { subscribe } from "./broker.js";

subscribe("orders", (msg) => {
  console.log("analytics got", msg.id);
});