export type Job = {
  id: string;
  state: "queued" | "running" | "done";
  createdAt: number;
  startedAt: number | null;
  finishedAt: number | null;
  ms: number;
};

const CONCURRENCY = 3;
const MAX_QUEUE = 20;

let running = 0;
const queue: Job[] = [];
const jobs = new Map<string, Job>();

function tryStartNext() {
  while (running < CONCURRENCY && queue.length > 0) {
    const job = queue.shift()!;
    job.state = "running";
    job.startedAt = Date.now();
    running++;
    setTimeout(() => {
      job.state = "done";
      job.finishedAt = Date.now();
      running--;
      tryStartNext();
    }, job.ms);
  }
}

export function submit(ms: number) {
  if (queue.length >= MAX_QUEUE) return { accepted: false as const, reason: "queue_full" as const };
  const id = "j_" + crypto.randomUUID().slice(0, 8);
  const job: Job = {
    id,
    state: "queued",
    createdAt: Date.now(),
    startedAt: null,
    finishedAt: null,
    ms
  };
  jobs.set(id, job);
  queue.push(job);
  tryStartNext();
  return { accepted: true as const, jobId: id };
}

export function getJob(id: string) {
  return jobs.get(id) || null;
}

export function stats() {
  const queued = queue.length;
  const done = [...jobs.values()].filter((j) => j.state === "done").length;
  return { concurrency: CONCURRENCY, maxQueue: MAX_QUEUE, running, queued, done, total: jobs.size };
}

export function reset() {
  queue.length = 0;
  jobs.clear();
  running = 0;
}

