function selectCards(cards, region, budget) {
  const seenGroups = new Set();
  return cards
    .filter((card) => {
      if (region === "explore" || !card.group) return true;
      if (seenGroups.has(card.group)) return false;
      seenGroups.add(card.group);
      return true;
    })
    .slice(0, budget)
    .map((card) => card.id);
}

console.log(
  selectCards(
    [
      { id: "a", group: "search" },
      { id: "b", group: "search" },
      { id: "c", group: null },
      { id: "d", group: null }
    ],
    "homepage",
    3
  )
);
