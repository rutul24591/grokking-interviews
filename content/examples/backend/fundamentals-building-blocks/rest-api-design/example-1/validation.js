// Input validation helpers for incoming API payloads.

function validateBook(input) {
  const errors = [];
  if (!input.title || typeof input.title !== "string") {
    errors.push("title is required");
  }
  if (!input.author || typeof input.author !== "string") {
    errors.push("author is required");
  }
  if (input.year !== undefined && typeof input.year !== "number") {
    errors.push("year must be a number");
  }
  return errors;
}

module.exports = { validateBook };
