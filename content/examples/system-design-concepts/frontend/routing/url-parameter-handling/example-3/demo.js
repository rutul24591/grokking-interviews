function stableQuery(entries) {
  return Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&");
}

console.log(stableQuery({ sort: "date", query: "router", page: "2" }));
