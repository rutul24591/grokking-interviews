function MVCC(){ this.versions={}; }
MVCC.prototype.write=function(k,v,ts){ this.versions[k]=this.versions[k]||[]; this.versions[k].push({v,ts}); };
MVCC.prototype.read=function(k,ts){ return (this.versions[k]||[]).filter(x=>x.ts<=ts).pop(); };
module.exports={ MVCC };