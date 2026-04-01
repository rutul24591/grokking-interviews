function sanitizeLog(event) {
  return {
    ...event,
    context: {
      ...event.context,
      email: undefined,
      token: undefined,
      cookies: undefined
    }
  };
}

console.log(
  sanitizeLog({
    message: "fail",
    context: { email: "user@example.com", token: "secret", requestId: "r-1", cookies: "session=abc" }
  })
);
