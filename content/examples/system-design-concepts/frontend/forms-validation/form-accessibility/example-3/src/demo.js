function detectFocusTrap({ invalidField, hiddenFields, focusOrder, usesCustomWidget }) {
  return {
    invalidField,
    trapped: hiddenFields.includes(invalidField) || !focusOrder.includes(invalidField) || usesCustomWidget,
    recovery: hiddenFields.includes(invalidField)
      ? "reveal-invalid-step"
      : usesCustomWidget
        ? "fallback-to-native-control"
        : "move-focus-to-invalid-control"
  };
}

console.log([
  { invalidField: "details", hiddenFields: ["details"], focusOrder: ["ticketTitle", "severity", "submit"], usesCustomWidget: false },
  { invalidField: "severity", hiddenFields: [], focusOrder: ["ticketTitle", "submit"], usesCustomWidget: true }
].map(detectFocusTrap));
