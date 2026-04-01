export type CategoryAssignment = {
  id: string;
  title: string;
  primaryCategory: string;
  secondaryCategory: string;
  confidence: "high" | "medium" | "low";
};

export const categorizationState = {
  availableCategories: ["Frontend", "Backend", "Requirements", "Problems"],
  assignments: [
    { id: "a1", title: "Streaming SSR", primaryCategory: "Frontend", secondaryCategory: "Rendering", confidence: "high" as const },
    { id: "a2", title: "RBAC", primaryCategory: "Requirements", secondaryCategory: "Identity", confidence: "medium" as const },
    { id: "a3", title: "Kafka Ordering", primaryCategory: "Backend", secondaryCategory: "Messaging", confidence: "low" as const }
  ],
  lastMessage: "Categorization UIs need clear primary versus secondary taxonomy ownership so content stays discoverable and stable over time."
};
