function routeModerationDecision(signal, policy) {
  const reasons = [];

  if (policy.severeCategories.includes(signal.category)) {
    reasons.push('severe_category');
    return {
      action: 'auto_block',
      requiresHumanReview: true,
      slaMinutes: 5,
      reasons,
    };
  }

  if (
    signal.accountAgeHours < policy.newAccountReviewHours ||
    signal.postsLastHour >= policy.velocityPostsPerHour
  ) {
    reasons.push('velocity_or_new_account_risk');
    return {
      action: 'queue_for_review',
      requiresHumanReview: true,
      slaMinutes: 15,
      reasons,
    };
  }

  const autoBlockThreshold = policy.autoBlockThreshold[signal.category] ?? 0.95;
  if (signal.confidence >= autoBlockThreshold) {
    reasons.push('above_auto_block_threshold');
    return {
      action: 'auto_block',
      requiresHumanReview: false,
      slaMinutes: null,
      reasons,
    };
  }

  const autoPassThreshold = policy.autoPassThreshold[signal.category] ?? 0.1;
  if (signal.confidence <= autoPassThreshold) {
    reasons.push('below_auto_pass_threshold');
    return {
      action: 'auto_pass',
      requiresHumanReview: false,
      slaMinutes: null,
      reasons,
    };
  }

  if (signal.confidence >= policy.borderlineBand.low && signal.confidence <= policy.borderlineBand.high) {
    reasons.push('borderline_classifier_confidence');
    return {
      action: 'llm_score_then_review',
      requiresHumanReview: true,
      slaMinutes: 30,
      reasons,
    };
  }

  reasons.push('default_review_policy');
  return {
    action: 'queue_for_review',
    requiresHumanReview: true,
    slaMinutes: 60,
    reasons,
  };
}

module.exports = { routeModerationDecision };
