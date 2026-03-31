import express from "express";

const app = express();
app.use(express.json());

const states = new Set<string>();

app.get("/oauth/start", (_req, res) => {
  const state = crypto.randomUUID();
  states.add(state);
  res.json({
    authorizationUrl: "https://provider.example.com/oauth/authorize?client_id=demo&scope=profile",
    state
  });
});

app.post("/oauth/exchange", (req, res) => {
  const { code, state } = req.body ?? {};
  if (!states.has(state)) {
    return res.status(400).json({ error: "invalid state" });
  }
  states.delete(state);
  res.json({
    user: {
      id: `user_${code}`,
      name: "System Design Reader",
      provider: "DevIdentity"
    }
  });
});

app.listen(Number(process.env.PORT || 4473), () => {
  console.log("OAuth integration API on http://localhost:4473");
});
