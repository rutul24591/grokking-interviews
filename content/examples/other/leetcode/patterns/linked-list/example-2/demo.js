function hasCycle(head) {
  let slow=head, fast=head;
  while(fast && fast.next){
    slow=slow.next; fast=fast.next.next;
    if(slow===fast) return true;
  }
  return false;
}
const a={v:"A",next:null}, b={v:"B",next:null}, c={v:"C",next:null};
a.next=b; b.next=c;
console.log(hasCycle(a));
c.next=b;
console.log(hasCycle(a));
