// BASE behavior simulation.

let state = null;
console.log('immediate', state);
setTimeout(() => { state = 'visible'; }, 50);
setTimeout(() => { console.log('eventual', state); }, 80);
