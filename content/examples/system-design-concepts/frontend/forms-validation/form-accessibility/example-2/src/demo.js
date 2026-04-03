function auditAccessibleField(field) {
  return {
    id: field.id,
    hasLabel: Boolean(field.labelId),
    hasDescription: Boolean(field.descriptionId),
    announcesErrors: field.describedBy.includes(field.errorId),
    keyboardReachable: field.tabIndex !== -1
  };
}

console.log([
  {
    id: "ticketTitle",
    labelId: "ticketTitle-label",
    descriptionId: "ticketTitle-description",
    errorId: "ticketTitle-error",
    describedBy: ["ticketTitle-description", "ticketTitle-error"],
    tabIndex: 0
  },
  {
    id: "severity",
    labelId: "",
    descriptionId: "severity-description",
    errorId: "severity-error",
    describedBy: ["severity-error"],
    tabIndex: -1
  }
].map(auditAccessibleField));
