const { track, summarize } = require('./ingest');
track({ type: 'pageview' });
track({ type: 'purchase' });
console.log(summarize());