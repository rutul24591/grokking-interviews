const { rebuild } = require('./rebuild');
console.log(rebuild([{ type: 'created' }, { type: 'paid' }]));