function createAnswerTraceStore() {
  const traces = [];

  return {
    record(trace) {
      traces.push({
        ...trace,
        recordedAt: new Date('2026-05-19T00:00:00.000Z').toISOString(),
      });
    },
    list() {
      return [...traces];
    },
    findByQuery(query) {
      return traces.filter((trace) => trace.query === query);
    },
  };
}

module.exports = { createAnswerTraceStore };
