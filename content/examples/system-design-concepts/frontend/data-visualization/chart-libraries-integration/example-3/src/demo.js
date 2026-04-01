function chartFallback(request) {
  if (!request.series.length) {
    return { state: "empty", fallback: "show-empty-insight", preserveFilters: true };
  }

  if (request.kind === "radar" && !request.librarySupportsKind) {
    return { state: "unsupported", fallback: "downgrade-to-bar", preserveLegend: true };
  }

  if (request.themeTokensMissing) {
    return { state: "degraded-theme", fallback: "use-default-palette", preserveLegend: true };
  }

  return { state: "render", fallback: null };
}

console.log(
  chartFallback({ kind: "radar", librarySupportsKind: false, themeTokensMissing: false, series: [{ id: "views" }] })
);
