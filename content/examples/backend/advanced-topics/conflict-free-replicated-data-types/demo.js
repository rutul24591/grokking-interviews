const { GCounter } = require('./gcounter');
const a=new GCounter('a'); const b=new GCounter('b');
a.inc(); b.inc(); b.inc();
a.merge(b); console.log(a.value());