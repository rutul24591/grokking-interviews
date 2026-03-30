let urlState = { q: 'cache', page: 3 };
let localInput = 'cache';
console.log('initial', { urlState, localInput });
localInput = 'cache invalidation';
console.log('typed locally', { urlState, localInput });
urlState = { q: 'cache', page: 2 };
localInput = urlState.q;
console.log('after back navigation reconcile', { urlState, localInput });
