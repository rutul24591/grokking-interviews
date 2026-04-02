type Message = { clientId: string; opId: string; message: string; acceptedAtMs: number };

const processed = new Set<string>();
const messages: Message[] = [];

export function reset() {
  processed.clear();
  messages.length = 0;
}

export function send(clientId: string, opId: string, message: string): { duplicate: boolean } {
  const key = `${clientId}:${opId}`;
  if (processed.has(key)) return { duplicate: true };
  processed.add(key);
  messages.unshift({ clientId, opId, message, acceptedAtMs: Date.now() });
  return { duplicate: false };
}

export function list() {
  return messages.slice(0, 50);
}

