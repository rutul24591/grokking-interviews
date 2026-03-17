function LSM(){ this.mem=[]; this.sst=[]; }
LSM.prototype.put=function(k,v){ this.mem.push([k,v]); };
LSM.prototype.flush=function(){ this.sst.push(this.mem.sort()); this.mem=[]; };
module.exports={ LSM };