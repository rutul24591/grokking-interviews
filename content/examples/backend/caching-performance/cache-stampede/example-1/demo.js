// Mutex stampede protection.

let lock = false;
function load(){ if(lock) return 'wait'; lock=true; setTimeout(()=>lock=false,50); return 'db'; }
console.log(load());
console.log(load());
