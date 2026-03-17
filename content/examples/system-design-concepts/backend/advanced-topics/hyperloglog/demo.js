const { HLL } = require('./hll');
const h=new HLL(); h.add(1); h.add(2); console.log(h.count());