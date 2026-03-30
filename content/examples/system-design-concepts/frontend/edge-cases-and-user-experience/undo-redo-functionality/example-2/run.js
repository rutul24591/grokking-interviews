let past = ['A'];
let present = 'B';
let future = ['C'];
console.log({ past, present, future });
past = [...past, present];
present = future[0];
future = future.slice(1);
console.log({ afterRedo: { past, present, future } });
