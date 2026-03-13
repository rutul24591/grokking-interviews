const { log } = require('./wal');
log({ op: 'SET', key: 'k1', value: 'v1' });