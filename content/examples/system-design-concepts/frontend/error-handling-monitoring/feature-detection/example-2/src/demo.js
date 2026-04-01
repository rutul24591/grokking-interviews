function selectCapabilityPlan(requirements) {
  const missingRequired = requirements.filter((requirement) => requirement.required && !requirement.supported);
  if (missingRequired.length > 0) {
    return { mode: "fallback", reason: missingRequired.map((item) => item.id) };
  }

  return {
    mode: "progressive-enhancement",
    enabledOptional: requirements.filter((requirement) => !requirement.required && requirement.supported).map((item) => item.id)
  };
}

console.log(
  selectCapabilityPlan([
    { id: "history-api", required: true, supported: true },
    { id: "clipboard", required: false, supported: true },
    { id: "service-worker", required: false, supported: false }
  ])
);
