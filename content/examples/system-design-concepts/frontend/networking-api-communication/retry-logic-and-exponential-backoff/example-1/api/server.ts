import express from "express";

const app = express();
const attemptsByRequest = new Map<string, number>();

app.get("/article", async (req, res) => {
  const requestId = String(req.query.requestId || "anonymous");
  const currentAttempt = (attemptsByRequest.get(requestId) ?? 0) + 1;
  attemptsByRequest.set(requestId, currentAttempt);

  await new Promise((resolve) => setTimeout(resolve, 80));

  if (currentAttempt < 3) {
    return res.status(503).json({
      ok: false,
      retryable: true,
      message: `transient upstream failure on attempt ${currentAttempt}`
    });
  }

  attemptsByRequest.delete(requestId);
  res.json({
    ok: true,
    retryable: false,
    message: `request succeeded on attempt ${currentAttempt}`
  });
});

app.listen(Number(process.env.PORT || 4420), () => {
  console.log("Retry example API on http://localhost:4420");
});
