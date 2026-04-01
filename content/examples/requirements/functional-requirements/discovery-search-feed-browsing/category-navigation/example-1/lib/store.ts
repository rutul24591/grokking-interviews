export const navigationState = {
  categories: [
    { id: "frontend", label: "Frontend", children: ["rendering", "performance"], contentCount: 42 },
    { id: "backend", label: "Backend", children: ["storage", "networking"], contentCount: 35 },
    { id: "requirements", label: "Requirements", children: ["identity", "feed"], contentCount: 28 }
  ],
  selectedCategory: "frontend",
  selectedChild: "rendering",
  breadcrumb: ["System Design", "Frontend", "Rendering"],
  lastMessage: "Navigation tree loaded."
};
