const { allow } = require('./token-bucket');
console.log('allowed', allow('user1', 5));