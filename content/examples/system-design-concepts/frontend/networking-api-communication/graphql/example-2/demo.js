const article = {
  title: "GraphQL for article screens",
  author: "Rina",
  readingTime: 12,
  body: "Deep body",
  comments: ["a", "b", "c"],
  relatedTopics: ["cache", "streaming"]
};

function executeSelection(selection) {
  return Object.fromEntries(selection.map((field) => [field, article[field]]));
}

for (const selection of [["title", "author"], ["title", "author", "comments", "relatedTopics"]]) {
  const payload = executeSelection(selection);
  console.log(`${selection.join(",")} -> ${JSON.stringify(payload)}`);
}
