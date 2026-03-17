function Node(val, level){ this.val=val; this.next=new Array(level).fill(null);} 
function SkipList(){ this.head=new Node(null,4);} 
SkipList.prototype.insert=function(val){ let node=new Node(val,1); node.next[0]=this.head.next[0]; this.head.next[0]=node; };
module.exports={ SkipList };