function chooseMobileFirstPlan(surface) {
  const singleColumn = surface.width < 480;
  const railMode = surface.width < 1024 ? "collapsible-context" : "persistent-context";
  return {
    id: surface.id,
    singleColumn,
    railMode,
    primaryActionPlacement: surface.thumbReachScore === "high" ? "bottom-action-cluster" : "top-toolbar-or-sidebar",
    needsRefactor: !surface.contentOrderStable || (singleColumn && surface.secondaryRailVisible)
  };
}

const surfaces = [
  { id: "phone-home", width: 390, thumbReachScore: "high", contentOrderStable: true, secondaryRailVisible: false },
  { id: "tablet-home", width: 820, thumbReachScore: "medium", contentOrderStable: true, secondaryRailVisible: true },
  { id: "broken-phone", width: 390, thumbReachScore: "high", contentOrderStable: false, secondaryRailVisible: true }
];

console.log(surfaces.map(chooseMobileFirstPlan));
