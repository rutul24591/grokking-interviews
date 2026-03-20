import express from "express";
import { z } from "zod";

type Content = {
  version: number;
  updatedAt: string;
  headline: string;
  body: string;
};

let content: Content = {
  version: 1,
  updatedAt: new Date().toISOString(),
  headline: "Initial publish",
  body: "This is the origin content.\n\nISR caches a snapshot and revalidates later.\n",
};

const app = express();
app.use(express.json());

app.get("/content", (_req, res) => {
  res.status(200).json(content);
});

const publishSchema = z.object({
  token: z.string().optional(),
});

app.post("/admin/publish", (req, res) => {
  const token = req.header("x-admin-token") ?? req.query.token ?? "";
  const parsed = publishSchema.safeParse({ token });
  if (!parsed.success || parsed.data.token !== "dev") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  content = {
    version: content.version + 1,
    updatedAt: new Date().toISOString(),
    headline: `Publish v${content.version + 1}`,
    body:
      `This content was updated at ${new Date().toLocaleTimeString()}.\n\n` +
      "With time-based ISR, the site may serve the previous snapshot until revalidation triggers.\n",
  };

  res.status(200).json({ ok: true, version: content.version });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

const port = Number(process.env.PORT || 4020);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Origin listening on http://localhost:${port}`);
});

