function createPromptVersion({ promptId, content, variableSchema, authorId, parentVersionId = null, label }) {
  return Object.freeze({
    versionId: `${promptId}:v${parentVersionId ? Number(parentVersionId.split(':v')[1]) + 1 : 1}`,
    promptId,
    content,
    variableSchema,
    authorId,
    parentVersionId,
    label,
    createdAt: '2026-05-20T00:00:00.000Z',
  });
}

function rollbackToVersion({ promptId, targetVersion, authorId, reason }) {
  return createPromptVersion({
    promptId,
    content: targetVersion.content,
    variableSchema: targetVersion.variableSchema,
    authorId,
    parentVersionId: targetVersion.versionId,
    label: `rollback: ${reason}`,
  });
}

function diffPromptText(previous, next) {
  const previousWords = previous.split(/\s+/);
  const nextWords = next.split(/\s+/);
  return {
    added: nextWords.filter((word) => !previousWords.includes(word)),
    removed: previousWords.filter((word) => !nextWords.includes(word)),
  };
}

module.exports = { createPromptVersion, diffPromptText, rollbackToVersion };
