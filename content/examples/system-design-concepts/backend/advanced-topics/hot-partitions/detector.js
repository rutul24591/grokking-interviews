function hotKeys(counts, threshold){
  return Object.entries(counts).filter(([,c])=>c>threshold).map(([k])=>k);
}
module.exports={ hotKeys };