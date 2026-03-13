// Standardized error envelope for API responses.

function errorPayload(code, message, details) {
  return { error: { code, message, details } };
}

module.exports = { errorPayload };
