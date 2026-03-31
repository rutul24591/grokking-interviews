const results = document.querySelector("#results");
const button = document.querySelector("#load-inspector");

const config = await fetch("/api/search-config").then((response) => response.json());
results.textContent = `Suggestions ready without the heavy inspector: ${config.suggestions.join(", ")}`;

button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Loading chunk...";

  const { renderInspector } = await import("./heavy-inspector.js");
  renderInspector(results, config.suggestions);

  button.textContent = "Inspector loaded";
});
