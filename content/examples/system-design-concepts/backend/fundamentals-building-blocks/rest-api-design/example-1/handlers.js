// Resource handlers for the books collection.

const { validateBook } = require("./validation");

let nextId = 3;
const books = [
  { id: 1, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", year: 2017 },
  { id: 2, title: "Release It!", author: "Michael T. Nygard", year: 2018 },
];

function listBooks() {
  return books;
}

function getBook(id) {
  return books.find((book) => book.id === id);
}

function createBook(input) {
  const errors = validateBook(input);
  if (errors.length) {
    return { error: { code: "BAD_REQUEST", message: "Validation failed", details: errors } };
  }

  const book = { id: nextId++, title: input.title, author: input.author, year: input.year };
  books.push(book);
  return { book };
}

module.exports = {
  listBooks,
  getBook,
  createBook,
};
