const { add, search } = require('./index');
add({ id: 'p1', text: 'fast storage' });
console.log(search('fast'));