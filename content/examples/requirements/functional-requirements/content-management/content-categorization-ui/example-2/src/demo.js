function categorizationReview(assignment) {
  const missing = ["primaryCategory", "secondaryCategory"].filter((field) => !assignment[field]);
  const crossTree = assignment.primaryCategory && assignment.secondaryCategory && !assignment.allowedSecondary.includes(assignment.secondaryCategory);
  return {
    status: missing.length > 0 ? "incomplete" : crossTree ? "invalid-tree" : assignment.confidence,
    escalateToEditor: missing.length > 0 || crossTree || assignment.confidence === "low",
    missing,
    crossTree
  };
}

console.log(categorizationReview({ primaryCategory: "Frontend", secondaryCategory: "Messaging", allowedSecondary: ["Rendering", "State"], confidence: "medium" }));
