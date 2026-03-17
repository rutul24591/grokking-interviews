function pickRegion(latencyMap) {
  return Object.entries(latencyMap).sort((a,b) => a[1]-b[1])[0][0];
}
module.exports = { pickRegion };