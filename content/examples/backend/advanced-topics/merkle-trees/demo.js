const { merkle, hash } = require('./merkle');
console.log(merkle([hash('a'),hash('b')]));