import express from "express";

const app = express();
app.use(express.json());

const sessions = new Map<string, { status: "pending" | "paid" }>();

app.post("/checkout/session", (_req, res) => {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { status: "pending" });
  res.status(201).json({
    sessionId,
    redirectUrl: `https://payments.example.com/checkout/${sessionId}`
  });
});

app.post("/checkout/complete/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "session missing" });
  session.status = "paid";
  res.status(204).end();
});

app.get("/checkout/status/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "session missing" });
  res.json(session);
});

app.listen(Number(process.env.PORT || 4474), () => {
  console.log("Payment gateway integration API on http://localhost:4474");
});
