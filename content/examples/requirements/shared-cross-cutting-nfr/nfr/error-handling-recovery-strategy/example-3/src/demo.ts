import { runSaga } from "./saga";

let reserved = false;
let charged = false;

const result = await runSaga([
  {
    name: "reserve_inventory",
    run: async () => {
      reserved = true;
      console.log("reserved");
    },
    compensate: async () => {
      reserved = false;
      console.log("unreserved");
    },
  },
  {
    name: "charge_payment",
    run: async () => {
      charged = true;
      console.log("charged");
      throw new Error("payment processor timeout");
    },
    compensate: async () => {
      charged = false;
      console.log("refunded");
    },
  },
]);

console.log({ result, reserved, charged });
if (!result.ok) process.exit(1);

