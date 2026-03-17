const speakeasy = require('speakeasy');
const secret = speakeasy.generateSecret({ name: 'example' });
console.log(secret.base32);