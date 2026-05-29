function buildResponseCacheKey(config) {
  return [
    config.testCaseId,
    config.model,
    config.modelVersion,
    `temp:${config.temperature}`,
    `max:${config.maxTokens}`,
    `prompt:${config.systemPromptHash}`,
  ].join('|');
}

function reserveProviderBudget(providerBudget, estimatedTokens) {
  const remainingTokens = providerBudget.tokensPerMinute - providerBudget.reservedTokens;
  if (estimatedTokens > remainingTokens) {
    return { ok: false, retryAfterMs: 60_000, remainingTokens };
  }
  return { ok: true, remainingTokens: remainingTokens - estimatedTokens };
}

module.exports = { buildResponseCacheKey, reserveProviderBudget };
