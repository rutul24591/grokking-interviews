function chooseReviewSubmissionPath(reviews) {
  return reviews.map((review) => ({
    id: review.id,
    path: review.containsText ? "text-review-pipeline" : "rating-only-write",
    premoderate: review.containsLink || review.accountAgeDays < 7,
    holdAverageUpdate: review.editedAfterPublish
  }));
}

console.log(chooseReviewSubmissionPath([
  { id: "rr-1", containsText: true, containsLink: false, accountAgeDays: 21, editedAfterPublish: false },
  { id: "rr-2", containsText: false, containsLink: true, accountAgeDays: 3, editedAfterPublish: true }
]));
