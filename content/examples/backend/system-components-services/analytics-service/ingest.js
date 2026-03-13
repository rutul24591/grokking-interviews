const events = [];
function track(evt) { events.push(evt); }
function summarize() { return events.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {}); }
module.exports = { track, summarize };