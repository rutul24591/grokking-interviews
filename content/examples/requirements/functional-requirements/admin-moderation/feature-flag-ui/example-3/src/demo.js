function unsafeToggle(flag) {
  const blocked = (flag.reviewRequired && flag.enabling && !flag.approved) || flag.errorRateIncrease > 0.15 || flag.onCallCoverage === false;
  return {
    blocked,
    action: blocked ? "hold-for-review" : "apply-change",
    rollback: flag.errorRateIncrease > 0.15
  };
}

console.log(unsafeToggle({ reviewRequired: true, enabling: true, approved: false, errorRateIncrease: 0.19, onCallCoverage: true }));
