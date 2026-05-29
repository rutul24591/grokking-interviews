const { excerpt } = require('./domain');

const NO_ANSWER_THRESHOLD = 0.5;
const HIGH_CONFIDENCE_THRESHOLD = 0.85;
const MEDIUM_CONFIDENCE_THRESHOLD = 0.65;

function canReadChunk(user, chunk) {
  if (chunk.tenantId !== user.tenantId) return false;
  return chunk.accessTags.every((tag) => user.accessTags.includes(tag));
}

function rankCandidates(user, chunks) {
  return chunks
    .filter((chunk) => canReadChunk(user, chunk))
    .sort((a, b) => b.score - a.score);
}

function confidenceForScore(score) {
  if (score >= HIGH_CONFIDENCE_THRESHOLD) return 'high';
  if (score >= MEDIUM_CONFIDENCE_THRESHOLD) return 'medium';
  if (score >= NO_ANSWER_THRESHOLD) return 'low';
  return 'none';
}

function packContext(candidates, options = {}) {
  const maxSources = options.maxSources ?? 4;
  const maxPerDocument = options.maxPerDocument ?? 2;
  const seenSections = new Set();
  const perDocument = new Map();
  const selected = [];

  for (const chunk of candidates) {
    if (selected.length >= maxSources) break;
    if (seenSections.has(chunk.parentSectionId)) continue;

    const currentForDocument = perDocument.get(chunk.documentId) ?? 0;
    if (currentForDocument >= maxPerDocument) continue;

    selected.push({
      sourceNumber: selected.length + 1,
      chunkId: chunk.id,
      documentId: chunk.documentId,
      documentTitle: chunk.documentTitle,
      documentVersion: chunk.documentVersion,
      page: chunk.page,
      excerpt: excerpt(chunk.text),
      score: chunk.score,
    });
    seenSections.add(chunk.parentSectionId);
    perDocument.set(chunk.documentId, currentForDocument + 1);
  }

  return {
    sources: selected,
    omittedChunks: Math.max(0, candidates.length - selected.length),
  };
}

function buildGroundedAnswer(query, user, chunks) {
  const candidates = rankCandidates(user, chunks);
  const topScore = candidates[0]?.score ?? 0;
  const confidence = confidenceForScore(topScore);

  if (topScore < NO_ANSWER_THRESHOLD) {
    return {
      mode: 'no-data',
      answer: `I do not have enough information in the indexed knowledge base to answer: "${query}".`,
      confidence: 'none',
      sources: [],
      telemetry: {
        topScore,
        includedChunks: 0,
        omittedChunks: candidates.length,
        noAnswerReason: 'top_score_below_threshold',
      },
    };
  }

  const packed = packContext(candidates);
  const citedClaim = packed.sources
    .map((source) => `[${source.sourceNumber}] ${source.excerpt}`)
    .join(' ');

  return {
    mode: 'answer',
    answer: `Grounded answer for "${query}": ${citedClaim}`,
    confidence,
    sources: packed.sources,
    telemetry: {
      topScore,
      includedChunks: packed.sources.length,
      omittedChunks: packed.omittedChunks,
    },
  };
}

module.exports = {
  NO_ANSWER_THRESHOLD,
  buildGroundedAnswer,
  canReadChunk,
  confidenceForScore,
  packContext,
  rankCandidates,
};
