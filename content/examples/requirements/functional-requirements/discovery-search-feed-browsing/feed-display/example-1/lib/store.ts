const allItems = [
  { id: "f1", type: "article", title: "How ranking works", author: "Avery" },
  { id: "f2", type: "collection", title: "Frontend interview playlist", author: "Riley" },
  { id: "f3", type: "article", title: "Caching failures in feeds", author: "Jordan" },
  { id: "f4", type: "article", title: "Search analytics you need", author: "Taylor" },
  { id: "f5", type: "collection", title: "System design study queue", author: "Quinn" }
];

export const feedState = {
  cursor: 0,
  pageSize: 3,
  items: allItems.slice(0, 3),
  remaining: allItems.length - 3,
  lastMessage: "Initial feed slice loaded."
};

export { allItems };
