// enqueue job
await queue.add('resize', { imageId: 'img_1' });

// worker
queue.process('resize', async (job) => {
  await resize(job.data.imageId);
});
