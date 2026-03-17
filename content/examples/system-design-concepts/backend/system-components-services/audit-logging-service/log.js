const fs = require('fs');
function append(event) {
  fs.appendFileSync('audit.log', JSON.stringify(event) + '\n');
}
module.exports = { append };