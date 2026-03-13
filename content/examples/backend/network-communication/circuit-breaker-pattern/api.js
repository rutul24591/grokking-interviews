import express from "express";
import { chargeCard } from "./payments-client.js";

const app = express();
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const result = await chargeCard(req.body.amount);
  if (!result.ok) {
    res.status(503).json({ error: result.error });
    return;
  }
  res.json({ status: "paid" });
});

app.listen(4200, () => console.log("api on :4200"));