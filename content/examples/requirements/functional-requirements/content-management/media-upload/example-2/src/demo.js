function scheduleUploads(queue, concurrency) {
  const active = queue.slice(0, concurrency).map((upload) => upload.id);
  const waiting = queue.slice(concurrency).map((upload) => upload.id);
  return { active, waiting, queueDepth: queue.length };
}

console.log(scheduleUploads([{ id: "u1" }, { id: "u2" }, { id: "u3" }, { id: "u4" }], 2));
