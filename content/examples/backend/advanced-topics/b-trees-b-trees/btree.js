function BTree(){ this.keys=[]; }
BTree.prototype.insert=function(k){ this.keys.push(k); this.keys.sort((a,b)=>a-b); };
module.exports={ BTree };