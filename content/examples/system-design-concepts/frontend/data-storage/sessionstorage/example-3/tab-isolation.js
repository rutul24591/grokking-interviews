const tabs = {
  tabA: new Map(),
  tabB: new Map()
};

tabs.tabA.set("draft", JSON.stringify({ step: 1 }));
tabs.tabB.set("draft", JSON.stringify({ step: 3 }));

console.log("tabA draft", JSON.parse(tabs.tabA.get("draft")));
console.log("tabB draft", JSON.parse(tabs.tabB.get("draft")));
console.log("isolated", tabs.tabA.get("draft") !== tabs.tabB.get("draft"));

