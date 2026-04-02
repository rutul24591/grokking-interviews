function prioritizeReports(reports) {
  return reports.map((report) => {
    const urgent = report.reason === "self-harm" || report.reportCount > 5 || report.targetType === "minor-account";
    return {
      id: report.id,
      queue: urgent ? "safety" : "general",
      urgent,
      autoHideCandidate: report.reason === "spam" && report.reportCount > 20
    };
  });
}

console.log(
  prioritizeReports([
    { id: "r1", reason: "self-harm", reportCount: 2, targetType: "comment" },
    { id: "r2", reason: "spam", reportCount: 28, targetType: "post" }
  ])
);
