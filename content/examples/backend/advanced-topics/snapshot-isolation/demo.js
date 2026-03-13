const { MVCC } = require('./mvcc');
const db=new MVCC(); db.write('k','v1',1); console.log(db.read('k',1));