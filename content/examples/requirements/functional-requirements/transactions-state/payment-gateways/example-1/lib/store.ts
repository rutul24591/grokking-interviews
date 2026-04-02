type RouteMode = "primary" | "failover";

const state = {
  routeMode: "primary" as RouteMode,
  attempts: [
    { id: "pay-1", gateway: "Stripe", status: "captured", retryEligible: false },
    { id: "pay-2", gateway: "Adyen", status: "timeout", retryEligible: true }
  ],
  lastMessage: "Payment-gateway orchestration should make route mode, gateway outcome, and retryability visible in one operator surface."
};

export function snapshot() {
  return structuredClone({
    routeMode: state.routeMode,
    attempts: state.attempts,
    summary: { retryEligible: state.attempts.filter((attempt) => attempt.retryEligible).length },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-route" | "retry-attempt", value?: string) {
  if (type === "switch-route") {
    state.routeMode = state.routeMode === "primary" ? "failover" : "primary";
    state.lastMessage = `Switched payment routing to ${state.routeMode}.`;
    return snapshot();
  }

  if (type === "retry-attempt" && value) {
    state.attempts = state.attempts.map((attempt) =>
      attempt.id === value
        ? { ...attempt, gateway: state.routeMode === "failover" ? "Stripe backup" : attempt.gateway, status: "processing", retryEligible: false }
        : attempt
    );
    state.lastMessage = `Retried gateway attempt ${value}.`;
  }
  return snapshot();
}
