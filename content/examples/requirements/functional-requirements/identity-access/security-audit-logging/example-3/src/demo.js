function shouldEscalate(events) {
  const failures = events.filter((event) => event === "login.failed").length;
  return failures >= 3 ? "escalate" : "observe";
}

console.log(shouldEscalate(["login.failed", "login.failed", "mfa.failed"]));
console.log(shouldEscalate(["login.failed", "login.failed", "login.failed"]));
