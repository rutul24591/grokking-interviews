const registry = new Map();
for (const scriptUrl of ["/sdk/chat.js", "/sdk/chat.js", "/sdk/analytics.js"]) {
  if (registry.has(scriptUrl)) {
    console.log(`${scriptUrl} -> reuse existing promise`);
    continue;
  }
  registry.set(scriptUrl, "loading");
  console.log(`${scriptUrl} -> create new loader promise`);
}
