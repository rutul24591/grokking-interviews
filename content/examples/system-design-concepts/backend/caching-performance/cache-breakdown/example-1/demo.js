// Hot key breakdown simulation.

let inflight = false;
function fetch(){
  if (inflight) return 'coalesce';
  inflight = true;
  setTimeout(()=>{ inflight = false; }, 50);
  return 'db';
}
console.log(fetch());
console.log(fetch());
