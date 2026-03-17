// Middleware pipeline for logging, auth, and validation.

function withLogging(next) {
  return async (req, res, context) => {
    const start = Date.now();
    const result = await next(req, res, context);
    const duration = Date.now() - start;
    context.logs.push({ step: "handler", duration });
    return result;
  };
}

function withAuth(next) {
  return async (req, res, context) => {
    if (req.headers["x-api-key"] !== "demo-key") {
      context.error = { status: 401, message: "unauthorized" };
      return null;
    }
    return next(req, res, context);
  };
}

function withValidation(next) {
  return async (req, res, context) => {
    if (!context.body || typeof context.body.input !== "string") {
      context.error = { status: 400, message: "invalid-input" };
      return null;
    }
    return next(req, res, context);
  };
}

module.exports = { withLogging, withAuth, withValidation };
