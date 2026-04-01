function exposureDecision({ environment, audience, containsSecrets }) {
  if (environment === "production" && containsSecrets) {
    return { policy: "private-only", rationale: "avoid-internal-source-leakage" };
  }

  if (environment === "production" && audience === "public-cdn") {
    return { policy: "disabled", rationale: "avoid-public-cdn-disclosure" };
  }

  return { policy: "public-ok", rationale: "non-production-or-internal-only" };
}

console.log(exposureDecision({ environment: "production", audience: "public-cdn", containsSecrets: true }));
