// Simulate a module-level cache.
const cache = new Map();

function handleRequest(userId) {
  if (!cache.has("greeting")) cache.set("greeting", `hello-${Math.random().toFixed(4)}`);
  // Bug: greeting is shared across all users/requests.
  return { userId, greeting: cache.get("greeting") };
}

process.stdout.write(`${JSON.stringify(handleRequest("user-a"))}\n`);
process.stdout.write(`${JSON.stringify(handleRequest("user-b"))}\n`);

