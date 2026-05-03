function kthSmallest(rows, k) {
  const heap = [];
  const push = (item) => { heap.push(item); heap.sort((a,b)=>a.value-b.value); };
  const pop = () => heap.shift();
  for (let r=0;r<rows.length;r+=1) if (rows[r].length) push({value:rows[r][0], r, c:0});
  let current=null;
  for (let i=0;i<k && heap.length;i+=1) {
    current = pop();
    const nextC = current.c+1;
    if (nextC < rows[current.r].length) push({value:rows[current.r][nextC], r:current.r, c:nextC});
  }
  return current?.value ?? null;
}

console.log(kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 8));
