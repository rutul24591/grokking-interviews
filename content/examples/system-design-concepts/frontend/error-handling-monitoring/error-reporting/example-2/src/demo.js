function redactPayload(payload) {
  return {
    surface: payload.surface,
    release: payload.release,
    fingerprint: payload.fingerprint,
    user: payload.user ? { id: payload.user.id, plan: payload.user.plan } : undefined,
    breadcrumbs: payload.breadcrumbs?.slice(-3).map((crumb) => crumb.replace(/token=[^&]+/g, "token=[redacted]"))
  };
}

console.log(
  redactPayload({
    surface: "search",
    release: "2026.04.01",
    fingerprint: "search-empty-state",
    user: { id: "u-14", email: "a@b.com", plan: "staff" },
    breadcrumbs: ["/", "/search?q=redis", "/search?q=redis&token=secret"]
  })
);
