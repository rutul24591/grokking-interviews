const { retry } = require('./retry');
retry(() => { throw new Error('x'); }, 3);