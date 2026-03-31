function propTunnelDepth(path) {
  return path.filter((component) => component.forwards).length;
}

const path = [
  { name: "Page", forwards: false },
  { name: "Shell", forwards: true },
  { name: "SidebarFrame", forwards: true },
  { name: "RecommendationsRail", forwards: false }
];

console.log({ tunnelDepth: propTunnelDepth(path), shouldExtractContext: propTunnelDepth(path) >= 2 });
