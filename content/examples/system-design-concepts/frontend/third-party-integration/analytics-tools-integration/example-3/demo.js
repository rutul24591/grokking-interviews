const payload = {
  consent: true,
  event: { type: "signup", metadata: { plan: "pro", email: "reader@example.com", accountId: "acct_123" } }
};

const safePayload = {
  ...payload,
  event: {
    ...payload.event,
    metadata: Object.fromEntries(Object.entries(payload.event.metadata).filter(([key]) => !["email", "accountId"].includes(key)))
  }
};

console.log(JSON.stringify(safePayload, null, 2));
