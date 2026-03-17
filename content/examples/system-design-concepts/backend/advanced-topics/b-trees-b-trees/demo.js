const { BTree } = require('./btree');
const t=new BTree(); t.insert(3); t.insert(1); console.log(t.keys);