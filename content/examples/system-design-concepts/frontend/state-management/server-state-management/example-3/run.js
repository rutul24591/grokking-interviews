const responses = [
  { request: 'q=rea', latencyMs: 240, seq: 1 },
  { request: 'q=react', latencyMs: 80, seq: 2 }
];
responses.sort((a, b) => a.latencyMs - b.latencyMs);
const accepted = responses.reduce((latest, response) => response.seq > latest.seq ? response : latest, { seq: 0 });
console.log({ responses, accepted });
