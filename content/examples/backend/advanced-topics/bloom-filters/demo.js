const { Bloom } = require('./bloom');
const b=new Bloom(128); b.add(42); console.log(b.maybeHas(42));