import express from "express";

type QueueJob = {
  id: number;
  label: string;
  status: "queued" | "processing" | "done";
};

const app = express();
app.use(express.json());

let nextId = 1;
let jobs: QueueJob[] = [];
let active = 0;
const concurrency = 2;

function processQueue() {
  const queued = jobs.filter((job) => job.status === "queued");
  while (active < concurrency && queued.length > 0) {
    const job = queued.shift();
    if (!job) break;
    job.status = "processing";
    active += 1;
    setTimeout(() => {
      job.status = "done";
      active -= 1;
      processQueue();
    }, 600);
  }
}

app.post("/jobs", (req, res) => {
  const job: QueueJob = {
    id: nextId++,
    label: String(req.body.label || `job-${nextId}`),
    status: "queued"
  };
  jobs = [job, ...jobs].slice(0, 20);
  processQueue();
  res.status(201).json(job);
});

app.get("/jobs", (_req, res) => {
  res.json({ jobs });
});

app.listen(Number(process.env.PORT || 4400), () => {
  console.log("Request queue API on http://localhost:4400");
});
