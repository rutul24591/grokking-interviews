function detectReviewEdgeCases(reviews) {
  const duplicates = reviews.filter((review, index) => reviews.findIndex((candidate) => candidate.userId === review.userId) !== index).map((review) => review.id);
  const abusiveEdits = reviews.filter((review) => review.editCount > review.maxEdits).map((review) => review.id);
  return {
    duplicates,
    abusiveEdits,
    blockAverageUpdate: duplicates.length > 0 || abusiveEdits.length > 0,
    queueModeratorReview: abusiveEdits.length > 0
  };
}

console.log(detectReviewEdgeCases([
  { id: "rr-1", userId: "u1", editCount: 1, maxEdits: 3 },
  { id: "rr-2", userId: "u1", editCount: 4, maxEdits: 2 }
]));
