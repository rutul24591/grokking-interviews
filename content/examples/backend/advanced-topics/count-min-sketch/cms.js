function CMS(depth, width){
  this.d=depth; this.w=width; this.table=Array.from({length:depth},()=>Array(width).fill(0));
}
CMS.prototype.add=function(h){
  for(let i=0;i<this.d;i++){ this.table[i][(h+i)%this.w]+=1; }
};
CMS.prototype.query=function(h){
  return Math.min(...this.table.map((row,i)=>row[(h+i)%this.w]));
};
module.exports={ CMS };