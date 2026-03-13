import express from "express";
import { createOrder } from "./orders-store.js";

const app = express();
app.use(express.json());

app.post("/orders", (req, res) => {
  const key = req.headers["idempotency-key"] || "";
  const order = createOrder(key, req.body);
  res.status(order.wasCreated ? 201 : 200).json(order.data);
});

app.listen(4300, () => console.log("orders api on :4300"));