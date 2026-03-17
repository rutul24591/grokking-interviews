const { capture } = require('./capture');

function onDbChange(row) {
  capture({ id: row.id, op: row.op });
}

onDbChange({ id: 'o1', op: 'update' });