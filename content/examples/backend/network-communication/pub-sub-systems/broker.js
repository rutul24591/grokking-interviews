const subscribers = new Map();

export function subscribe(topic, fn) {
  if (!subscribers.has(topic)) subscribers.set(topic, []);
  subscribers.get(topic).push(fn);
}

export function publish(topic, message) {
  const subs = subscribers.get(topic) || [];
  subs.forEach((fn) => fn(message));
}