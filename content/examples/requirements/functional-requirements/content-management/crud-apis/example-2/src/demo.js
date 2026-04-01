function validateUpdate(before, patch) {
  return {
    immutableIdChanged: Boolean(patch.id && patch.id !== before.id),
    allowedFieldsOnly: Object.keys(patch).every((field) => ["title", "status"].includes(field))
  };
}

console.log(validateUpdate({ id: "c-101", title: "Preview", status: "draft" }, { title: "Preview updated" }));
