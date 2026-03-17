const { logSlowQuery } = require('./db-monitor');
logSlowQuery('SELECT * FROM orders', 250);