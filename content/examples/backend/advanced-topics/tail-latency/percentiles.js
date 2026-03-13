function p99(values){
  const sorted=[...values].sort((a,b)=>a-b);
  return sorted[Math.floor(sorted.length*0.99)];
}
module.exports={ p99 };