class MinStack {
  constructor() { this.values=[]; this.mins=[]; }
  push(x){ this.values.push(x); if(!this.mins.length || x<=this.mins[this.mins.length-1]) this.mins.push(x); }
  pop(){ if(!this.values.length) throw new Error("underflow"); const v=this.values.pop(); if(v===this.mins[this.mins.length-1]) this.mins.pop(); return v; }
  min(){ return this.mins[this.mins.length-1] ?? null; }
}
const s=new MinStack();
s.push(5); s.push(3); s.push(3); s.push(8);
console.log(s.min()); s.pop(); s.pop(); console.log(s.min());
