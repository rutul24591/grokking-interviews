function indexingFreshness(lagMinutes, budgetMinutes, backlogSize) {
  return {
    healthy: lagMinutes <= budgetMinutes && backlogSize < 5,
    action: lagMinutes > budgetMinutes || backlogSize >= 5 ? "escalate-index-backlog" : "none"
  };
}

console.log(indexingFreshness(22, 10, 6));
