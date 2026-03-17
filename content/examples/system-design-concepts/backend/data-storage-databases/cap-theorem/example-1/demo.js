// CAP choice demo.

function handle(partitioned, mode){
  if (!partitioned) return 'ok';
  return mode === 'CP' ? 'reject' : 'serve-stale';
}

console.log(handle(true, 'CP'));
console.log(handle(true, 'AP'));
