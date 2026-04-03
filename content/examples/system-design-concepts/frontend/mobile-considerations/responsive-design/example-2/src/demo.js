function chooseResponsiveStrategy(viewport) {
  const denseAllowed = viewport.width >= 1024 && viewport.tapTargetSafe;
  const navigationMode = viewport.width < 500 ? "bottom-nav" : viewport.width < 1024 ? "touch-safe-rail" : "desktop-rail";
  return {
    id: viewport.id,
    denseAllowed,
    navigationMode,
    preserveSemanticOrder: viewport.readingOrderStable
  };
}

const viewports = [
  { id: "phone", width: 390, tapTargetSafe: true, readingOrderStable: true },
  { id: "tablet", width: 820, tapTargetSafe: true, readingOrderStable: true },
  { id: "broken-desktop", width: 1280, tapTargetSafe: false, readingOrderStable: false }
];

console.log(viewports.map(chooseResponsiveStrategy));
