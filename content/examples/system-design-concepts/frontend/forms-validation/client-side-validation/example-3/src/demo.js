function detectSchemaDrift({ renderedFields, schemaFields, requiredFields, hiddenServerRules }) {
  const missingInSchema = renderedFields.filter((field) => !schemaFields.includes(field));
  const hiddenRequired = requiredFields.filter((field) => !renderedFields.includes(field));
  return {
    status: missingInSchema.length || hiddenRequired.length || hiddenServerRules.length ? "block-submit" : "ok",
    missingInSchema,
    hiddenRequired,
    hiddenServerRules
  };
}

console.log([
  {
    renderedFields: ["displayName", "email", "password", "confirmPassword"],
    schemaFields: ["displayName", "email", "password"],
    requiredFields: ["displayName", "email", "password", "region"],
    hiddenServerRules: ["geo-allowlist"]
  },
  {
    renderedFields: ["displayName", "email", "password", "confirmPassword", "region"],
    schemaFields: ["displayName", "email", "password", "confirmPassword", "region"],
    requiredFields: ["displayName", "email", "password", "region"],
    hiddenServerRules: []
  }
].map(detectSchemaDrift));
