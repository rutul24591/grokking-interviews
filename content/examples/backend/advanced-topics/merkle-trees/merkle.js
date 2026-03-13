const crypto = require('crypto');
function hash(x){return crypto.createHash('sha256').update(x).digest('hex');}
function merkle(leaves){
  if (leaves.length===1) return leaves[0];
  const next=[];
  for(let i=0;i<leaves.length;i+=2){
    const left=leaves[i]; const right=leaves[i+1]||left;
    next.push(hash(left+right));
  }
  return merkle(next);
}
module.exports={ merkle, hash };