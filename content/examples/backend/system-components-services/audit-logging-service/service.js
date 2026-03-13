const { append } = require('./log');
append({ actor: 'u1', action: 'login', ts: Date.now() });