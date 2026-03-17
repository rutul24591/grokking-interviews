const { encrypt } = require('./encrypt');
const key = crypto.randomBytes(32);
const payload = encrypt(Buffer.from('doc'), key);
