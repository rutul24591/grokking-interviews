function HLL(){ this.registers = new Array(16).fill(0); }
HLL.prototype.add=function(h){ const idx=h%this.registers.length; this.registers[idx]=Math.max(this.registers[idx], 1); };
HLL.prototype.count=function(){ return this.registers.reduce((a,b)=>a+b,0); };
module.exports={ HLL };