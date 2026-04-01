const editState = {
  title: "Content storage trade-offs",
  summary: "Draft comparing warm and cold storage decisions for editorial assets.",
  status: "draft" as "draft" | "review",
  dirty: false,
  revision: 18,
  lastMessage: "Editing surfaces should expose revision and workflow state while authors are making changes."
};

export function snapshot() {
  return structuredClone(editState);
}

export function updateField(field: "title" | "summary" | "status", value: string) {
  if (field === "title") editState.title = value;
  if (field === "summary") editState.summary = value;
  if (field === "status") editState.status = value as "draft" | "review";
  editState.dirty = true;
  editState.revision += 1;
  editState.lastMessage = `Updated ${field}; revision ${editState.revision} is waiting for save or review.`;
  return snapshot();
}
