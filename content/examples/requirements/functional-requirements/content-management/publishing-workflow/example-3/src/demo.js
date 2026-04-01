function publishBypassPolicy({ currentStage, requestedStage }) {
  return {
    blocked: currentStage === "draft" && requestedStage === "published",
    action: currentStage === "draft" && requestedStage === "published" ? "force-review-path" : "allow-transition"
  };
}

console.log(publishBypassPolicy({ currentStage: "draft", requestedStage: "published" }));
