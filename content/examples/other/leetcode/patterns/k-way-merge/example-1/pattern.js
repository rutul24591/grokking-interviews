class MinHeap {
  constructor(compare) { this.compare = compare; this.items = []; }
  push(x){ this.items.push(x); this.#up(this.items.length-1); }
  pop(){ if(!this.items.length) throw new Error("underflow"); const min=this.items[0]; const last=this.items.pop(); if(this.items.length){ this.items[0]=last; this.#down(0);} return min; }
  #up(i){ while(i>0){ const p=Math.floor((i-1)/2); if(this.compare(this.items[i],this.items[p])>=0) break; [this.items[i],this.items[p]]=[this.items[p],this.items[i]]; i=p; } }
  #down(i){ while(true){ let b=i; const l=i*2+1, r=i*2+2; if(l<this.items.length && this.compare(this.items[l],this.items[b])<0) b=l; if(r<this.items.length && this.compare(this.items[r],this.items[b])<0) b=r; if(b===i) return; [this.items[i],this.items[b]]=[this.items[b],this.items[i]]; i=b; } }
}

function mergeKSorted(arrays) {
  const heap = new MinHeap((a,b)=>a.value-b.value);
  for (let i=0;i<arrays.length;i+=1) if (arrays[i].length) heap.push({value:arrays[i][0], i, j:0});
  const out=[];
  while (heap.items.length) {
    const {value,i,j} = heap.pop();
    out.push(value);
    const nextJ = j+1;
    if (nextJ < arrays[i].length) heap.push({value:arrays[i][nextJ], i, j:nextJ});
  }
  return out;
}

module.exports = { mergeKSorted };
