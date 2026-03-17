const store = require('./storage');
store.put('file1', Buffer.from('hello'));
console.log(store.get('file1').toString());