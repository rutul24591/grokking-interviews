const { acquire, release } = require('./bulkhead');
if (acquire()) { /* call dependency */ release(); }