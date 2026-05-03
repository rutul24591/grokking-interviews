function reverseBetween(head, m, n) {
  if (!head || m === n) return head;
  const dummy = { next: head };
  let prev = dummy;
  for (let i = 1; i < m; i += 1) prev = prev.next;
  let curr = prev.next;
  for (let i = 0; i < n - m; i += 1) {
    const move = curr.next;
    curr.next = move.next;
    move.next = prev.next;
    prev.next = move;
  }
  return dummy.next;
}

function build(values) { const nodes = values.map(v=>({v,next:null})); for(let i=0;i<nodes.length-1;i++) nodes[i].next=nodes[i+1]; return nodes[0]??null; }
function toArray(h){ const o=[]; while(h){o.push(h.v); h=h.next;} return o; }

console.log(toArray(reverseBetween(build([1,2,3,4,5]), 2, 4)));
