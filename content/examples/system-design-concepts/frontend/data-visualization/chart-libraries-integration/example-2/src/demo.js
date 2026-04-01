function normalizeSeries(rawSeries) {
  return rawSeries.map((series) => ({
    id: series.metric,
    name: series.label,
    kind: series.visualization,
    points: series.values.map((value) => ({ label: value.bucket, value: value.count })),
    unit: series.unit ?? "count",
    yAxis: series.unit === "percentage" ? "right" : "left"
  }));
}

console.log(
  normalizeSeries([
    { metric: "views", label: "Views", visualization: "line", unit: "count", values: [{ bucket: "Mon", count: 12 }] },
    { metric: "ctr", label: "CTR", visualization: "line", unit: "percentage", values: [{ bucket: "Mon", count: 4.2 }] }
  ])
);
