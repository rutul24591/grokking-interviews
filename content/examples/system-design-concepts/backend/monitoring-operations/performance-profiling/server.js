const { profile } = require('./profiler');
profile(() => { for (let i = 0; i < 1e6; i += 1) {} });