const { call } = require('./breaker');
call(() => { throw new Error('down'); });