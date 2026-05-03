const { removeNthFromEnd } = require("./pattern");
function build(vals){const nodes=vals.map(v=>({v,next:null})); for(let i=0;i<nodes.length-1;i++) nodes[i].next=nodes[i+1]; return nodes[0]??null;}
function toArray(h){const o=[]; while(h){o.push(h.v); h=h.next;} return o;}
console.log(toArray(removeNthFromEnd(build([1,2,3,4,5]), 2)));
console.log(toArray(removeNthFromEnd(build([1]), 1)));
