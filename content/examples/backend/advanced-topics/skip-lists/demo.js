const { SkipList } = require('./skiplist');
const s=new SkipList(); s.insert(5); console.log(s.head.next[0].val);