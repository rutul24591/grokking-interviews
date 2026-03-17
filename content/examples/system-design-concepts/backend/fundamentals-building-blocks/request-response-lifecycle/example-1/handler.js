// Core business logic handler.

async function handleRequest(context) {
  return {
    output: context.body.input.toUpperCase(),
    requestId: context.requestId,
  };
}

module.exports = { handleRequest };
