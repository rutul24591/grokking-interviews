function detectRtlBreakage({ locale, iconMirrored, technicalIdIsolated, flexOrderMirrored, sidebarMoved }) {
  const isRtl = ["ar", "he", "fa"].includes(locale);
  return {
    broken: isRtl && (!iconMirrored || !technicalIdIsolated || !flexOrderMirrored || !sidebarMoved),
    reasons: [
      !iconMirrored ? "icon-not-mirrored" : null,
      !technicalIdIsolated ? "technical-id-not-isolated" : null,
      !flexOrderMirrored ? "layout-order-not-mirrored" : null,
      !sidebarMoved ? "sidebar-placement-not-mirrored" : null
    ].filter(Boolean)
  };
}

console.log([
  { locale: "ar", iconMirrored: false, technicalIdIsolated: true, flexOrderMirrored: false, sidebarMoved: true },
  { locale: "he", iconMirrored: true, technicalIdIsolated: true, flexOrderMirrored: true, sidebarMoved: false },
  { locale: "en", iconMirrored: false, technicalIdIsolated: false, flexOrderMirrored: false, sidebarMoved: false }
].map(detectRtlBreakage));
