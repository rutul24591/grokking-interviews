function GCounter(id) { this.id=id; this.counts={}; }
GCounter.prototype.inc=function(){ this.counts[this.id]=(this.counts[this.id]||0)+1; };
GCounter.prototype.merge=function(other){
  for (const k in other.counts){ this.counts[k]=Math.max(this.counts[k]||0, other.counts[k]);}
};
GCounter.prototype.value=function(){ return Object.values(this.counts).reduce((a,b)=>a+b,0); };
module.exports = { GCounter };