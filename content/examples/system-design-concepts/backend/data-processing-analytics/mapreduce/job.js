const { map } = require('./map');
const { reduce } = require('./reduce');
const pairs = map('a b a');
console.log(reduce(pairs));