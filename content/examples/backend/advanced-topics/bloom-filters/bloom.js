function Bloom(size){ this.bits=new Array(size).fill(0); }
Bloom.prototype.add=function(h){ this.bits[h%this.bits.length]=1; };
Bloom.prototype.maybeHas=function(h){ return this.bits[h%this.bits.length]===1; };
module.exports={ Bloom };