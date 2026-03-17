const queue = require('./queue');

queue.consume('email-jobs-dlq', async (msg) => {
  console.log('DLQ message', msg.id, msg.error);
});