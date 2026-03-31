const jobs = [
  { id: "j1", priority: "low" },
  { id: "j2", priority: "high" },
  { id: "j3", priority: "low" },
  { id: "j4", priority: "high" }
];

jobs.sort((left, right) => (left.priority === right.priority ? 0 : left.priority === "high" ? -1 : 1));
for (const job of jobs) {
  console.log(`dispatch ${job.id} (${job.priority})`);
}
