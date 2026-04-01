const editorState = {
  title: "Rich text editing considerations",
  body: [
    { type: "paragraph" as const, text: "Structured editing should preserve semantic intent." },
    { type: "heading" as const, text: "Editor state drives formatting and export behavior." }
  ],
  activeFormat: "paragraph" as "paragraph" | "heading" | "callout",
  validationIssues: [] as string[],
  lastMessage: "Rich text editors should make formatting state explicit instead of hiding structural document changes."
};

export function snapshot() {
  return structuredClone(editorState);
}

export function mutate(type: "format" | "append") {
  if (type === "format") {
    editorState.activeFormat = editorState.activeFormat === "paragraph" ? "heading" : editorState.activeFormat === "heading" ? "callout" : "paragraph";
    editorState.lastMessage = `Switched active formatting mode to ${editorState.activeFormat}.`;
  }

  if (type === "append") {
    editorState.body.push({ type: editorState.activeFormat, text: `New ${editorState.activeFormat} block inserted by the author.` });
    editorState.lastMessage = "Inserted a new block using the current editor format mode.";
  }

  editorState.validationIssues = editorState.body.filter((block) => block.type === "heading").length > 2 ? ["Too many heading blocks at the top level"] : [];
  return snapshot();
}
