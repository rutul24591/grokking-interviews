function normalizeProviderEvent(provider, event) {
  if (provider === 'openai') {
    if (event === '[DONE]') return { type: 'done' };
    if (event.choices?.[0]?.delta?.content) {
      return { type: 'token', text: event.choices[0].delta.content };
    }
    if (event.choices?.[0]?.finish_reason) {
      return { type: 'done', reason: event.choices[0].finish_reason };
    }
  }

  if (provider === 'anthropic') {
    if (event.type === 'content_block_delta') {
      return { type: 'token', text: event.delta.text };
    }
    if (event.type === 'message_stop') return { type: 'done' };
  }

  return { type: 'ignored' };
}

function chooseProvider({ primaryHealthy, fallbackAllowed, dataResidencyRequired }) {
  if (primaryHealthy) return { provider: 'primary', degraded: false };
  if (!fallbackAllowed || dataResidencyRequired) {
    return { provider: null, degraded: false, failClosed: true };
  }
  return { provider: 'fallback', degraded: true };
}

function shouldWarnForContext({ currentTokens, maxTokens }) {
  return currentTokens / maxTokens >= 0.8;
}

module.exports = {
  chooseProvider,
  normalizeProviderEvent,
  shouldWarnForContext,
};
