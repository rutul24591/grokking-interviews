// Simple in-memory repository that could be swapped for a database.

let nextId = 3;
const items = [
  { id: 1, name: "Router", stock: 7 },
  { id: 2, name: "Switch", stock: 12 },
];

function listItems() {
  return items.slice();
}

function getItem(id) {
  return items.find((item) => item.id === id);
}

function createItem(input) {
  const item = { id: nextId++, name: input.name, stock: input.stock };
  items.push(item);
  return item;
}

module.exports = {
  listItems,
  getItem,
  createItem,
};
