// Business logic layer that enforces rules independent of HTTP transport.

const repository = require("./repository");

const sessions = new Map();

function listItems() {
  return repository.listItems();
}

function getItem(id) {
  return repository.getItem(id);
}

function createItem(input) {
  if (!input.name || typeof input.name !== "string") {
    return { error: "Item name is required." };
  }
  if (typeof input.stock !== "number" || input.stock < 0) {
    return { error: "Stock must be a non-negative number." };
  }
  return { item: repository.createItem(input) };
}

function startSession(clientId) {
  const session = { clientId, startedAt: new Date().toISOString(), hits: 0 };
  sessions.set(clientId, session);
  return session;
}

function hitSession(clientId) {
  const session = sessions.get(clientId);
  if (!session) return null;
  session.hits += 1;
  return session;
}

module.exports = {
  listItems,
  getItem,
  createItem,
  startSession,
  hitSession,
};
