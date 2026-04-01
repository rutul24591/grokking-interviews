function deletionRecommendation(referenceCount) {
  return {
    mode: referenceCount > 0 ? "archive" : "delete",
    reviewRequired: referenceCount > 0
  };
}

console.log(deletionRecommendation(4));
