import { subscribe } from "./broker.js";

subscribe("orders", (msg) => {
  setTimeout(() => {
    console.log("email sent for", msg.id);
  }, 500);
});