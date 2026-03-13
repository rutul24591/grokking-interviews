import express from "express";
import { enqueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post("/orders", (req, res) => {
  enqueue({ id: Date.now(), payload: req.body });
  res.status(202).json({ status: "queued" });
});

app.listen(5400, () => console.log("producer on :5400"));