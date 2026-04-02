type Failure = { operation: string; status: 'timeout' | 'validation' | 'dependency' | 'throttle'; retryable: boolean; userImpact: 'low' | 'medium' | 'high' };

function pickRecoveryPlan(failure: Failure) {
  if (!failure.retryable || failure.status === 'validation') return { ...failure, plan: 'surface-actionable-error' };
  if (failure.status === 'dependency' && failure.userImpact === 'high') return { ...failure, plan: 'serve-fallback-and-page-oncall' };
  if (failure.status === 'throttle') return { ...failure, plan: 'queue-and-backoff' };
  return { ...failure, plan: 'retry-with-jitter' };
}

const plans = [
  { operation: 'checkout', status: 'dependency', retryable: true, userImpact: 'high' },
  { operation: 'profile-save', status: 'validation', retryable: false, userImpact: 'medium' },
  { operation: 'feed-refresh', status: 'throttle', retryable: true, userImpact: 'low' },
].map(pickRecoveryPlan);

console.table(plans);
if (plans[0].plan !== 'serve-fallback-and-page-oncall') throw new Error('Checkout dependency failure should trigger fallback + paging');
