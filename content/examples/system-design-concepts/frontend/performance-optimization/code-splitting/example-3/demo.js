const chunkGraph = {
  route: ["search-shell"],
  "search-shell": ["filters-panel", "chart-panel"],
  "filters-panel": ["vendor-fuse"],
  "chart-panel": ["vendor-d3"],
  "vendor-fuse": [],
  "vendor-d3": [],
};

function longestChain(node) {
  const children = chunkGraph[node] || [];
  if (children.length === 0) return [node];

  const deepest = children
    .map((child) => longestChain(child))
    .sort((left, right) => right.length - left.length)[0];

  return [node, ...deepest];
}

const path = longestChain("route");
console.log(`Longest async chain: ${path.join(" -> ")}`);
console.log(`Nested requests after first chunk: ${path.length - 1}`);

if (path.length > 3) {
  console.log("status: fail - split points create a request waterfall");
}
