const queue = require('./queue');

queue.consume('email-jobs', async (msg, ack, nack) => {
  try {
    if (!msg.email) throw new Error('missing email');
    // send email
    ack();
  } catch (err) {
    nack(err);
  }
});