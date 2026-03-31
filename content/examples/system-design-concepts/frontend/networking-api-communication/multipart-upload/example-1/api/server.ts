import express from "express";

type UploadRecord = {
  uploadedParts: Set<number>;
};

const app = express();
app.use(express.json({ limit: "1mb" }));

const uploads = new Map<string, UploadRecord>();

app.post("/uploads/start", (_req, res) => {
  const uploadId = crypto.randomUUID();
  uploads.set(uploadId, { uploadedParts: new Set() });
  res.status(201).json({ uploadId });
});

app.post("/uploads/:uploadId/parts", async (req, res) => {
  const record = uploads.get(req.params.uploadId);
  if (!record) {
    return res.status(404).json({ error: "upload not found" });
  }
  await new Promise((resolve) => setTimeout(resolve, 120));
  record.uploadedParts.add(Number(req.body.partNumber));
  return res.status(201).json({ ok: true });
});

app.post("/uploads/:uploadId/complete", (req, res) => {
  const record = uploads.get(req.params.uploadId);
  if (!record) {
    return res.status(404).json({ error: "upload not found" });
  }
  res.json({ completedParts: Array.from(record.uploadedParts).sort((left, right) => left - right) });
});

app.listen(Number(process.env.PORT || 4370), () => {
  console.log("Multipart upload API on http://localhost:4370");
});
