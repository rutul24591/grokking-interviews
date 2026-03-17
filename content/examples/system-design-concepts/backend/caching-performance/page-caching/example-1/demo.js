// Page cache.

const cache = new Map([['/home','<html>...</html>']]);
console.log(cache.get('/home'));
