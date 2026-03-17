const queue = [];
const deadLetter = [];

export function enqueue(message) {
  queue.push({ ...message, attempts: 0 });
}

export function dequeue() {
  return queue.shift();
}

export function fail(message) {
  message.attempts += 1;
  if (message.attempts >= 3) {
    deadLetter.push(message);
  } else {
    queue.push(message);
  }
}

export function stats() {
  return { queueSize: queue.length, deadLetterSize: deadLetter.length };
}