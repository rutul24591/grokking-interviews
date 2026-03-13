const { LSM } = require('./lsm');
const l=new LSM(); l.put('a',1); l.flush(); console.log(l.sst.length);