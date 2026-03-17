const { withTimeout } = require('./timeout');
withTimeout(new Promise(() => {}), 100);