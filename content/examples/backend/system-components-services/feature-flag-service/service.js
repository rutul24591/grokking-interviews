const { enabled } = require('./flags');
console.log('flag', enabled('newCheckout', 42));