const fs = require('fs');
function sendFile(path, res){
  fs.createReadStream(path).pipe(res);
}
module.exports={ sendFile };