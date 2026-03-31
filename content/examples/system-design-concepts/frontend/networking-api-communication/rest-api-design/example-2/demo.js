const candidates = [
  { method: "GET", path: "/articles", valid: true },
  { method: "POST", path: "/articles/123/comments", valid: true },
  { method: "POST", path: "/createComment", valid: false },
  { method: "GET", path: "/fetchArticleById", valid: false }
];

for (const candidate of candidates) {
  console.log(`${candidate.method} ${candidate.path} -> ${candidate.valid ? "resource-oriented" : "verb endpoint smell"}`);
}
