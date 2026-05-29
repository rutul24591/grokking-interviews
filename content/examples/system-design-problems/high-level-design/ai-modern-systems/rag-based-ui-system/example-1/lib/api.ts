const { buildGroundedAnswer } = require('./policies');

function answerRagQuery({ query, user, chunks, traceStore }) {
  const result = buildGroundedAnswer(query, user, chunks);
  traceStore.record({
    query,
    tenantId: user.tenantId,
    mode: result.mode,
    confidence: result.confidence,
    sourceIds: result.sources.map((source) => source.chunkId),
    telemetry: result.telemetry,
  });
  return result;
}

module.exports = { answerRagQuery };
