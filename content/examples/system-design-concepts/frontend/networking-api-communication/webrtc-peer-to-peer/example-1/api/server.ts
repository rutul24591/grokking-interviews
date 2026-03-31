import express from "express";

type SignalMessage = {
  id: number;
  to: "offerer" | "answerer";
  type: "offer" | "answer" | "candidate";
  payload: string;
};

const app = express();
app.use(express.json({ limit: "1mb" }));

let nextId = 1;
const rooms = new Map<string, SignalMessage[]>();

app.post("/rooms/:roomId/reset", (req, res) => {
  rooms.set(req.params.roomId, []);
  res.status(204).end();
});

app.post("/rooms/:roomId/signals", (req, res) => {
  const current = rooms.get(req.params.roomId) ?? [];
  const message: SignalMessage = {
    id: nextId++,
    to: req.body.to,
    type: req.body.type,
    payload: req.body.payload
  };
  current.push(message);
  rooms.set(req.params.roomId, current);
  res.status(201).json({ id: message.id });
});

app.get("/rooms/:roomId/signals", (req, res) => {
  const current = rooms.get(req.params.roomId) ?? [];
  const to = String(req.query.to || "");
  const after = Number(req.query.after || 0);
  res.json({
    items: current.filter((message) => message.to === to && message.id > after)
  });
});

app.listen(Number(process.env.PORT || 4450), () => {
  console.log("WebRTC signaling API on http://localhost:4450");
});
