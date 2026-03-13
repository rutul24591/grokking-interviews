const { accept } = require('./dedup');
console.log(accept({ id: 'e1' }));
console.log(accept({ id: 'e1' }));