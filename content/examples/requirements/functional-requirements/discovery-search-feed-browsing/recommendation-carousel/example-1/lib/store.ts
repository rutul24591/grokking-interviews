export type Module = { id: string; title: string; slot: "hero" | "sidebar" | "footer"; priority: number; inventory: number };
export const carouselState = {
  slot: "hero" as Module["slot"],
  modules: [
    { id: "m1", title: "Trending now", slot: "hero", priority: 95, inventory: 8 },
    { id: "m2", title: "Because you read sharding", slot: "hero", priority: 91, inventory: 5 },
    { id: "m3", title: "New for principal engineers", slot: "sidebar", priority: 86, inventory: 4 },
    { id: "m4", title: "Continue your research", slot: "footer", priority: 80, inventory: 6 }
  ],
  renderedIds: ["m1", "m2"],
  lastMessage: "Hero slot currently shows the top two high-priority modules."
};
