function resolveConfiguration(layers) {
  const applied = layers.find((layer) => layer.value !== undefined && layer.value !== null);
  return {
    value: applied?.value,
    source: applied?.source ?? "unset",
    reviewRequired: applied?.source === "production-override"
  };
}

console.log(
  resolveConfiguration([
    { source: "production-override", value: "80" },
    { source: "service-default", value: "72" }
  ])
);
