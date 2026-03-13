const { verify } = require('./read');

function audit(files) {
  for (const f of files) verify(f);
}

module.exports = { audit };