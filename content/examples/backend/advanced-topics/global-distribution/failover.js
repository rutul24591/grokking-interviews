function failover(regions, unhealthy) {
  return regions.find(r => r !== unhealthy);
}
module.exports = { failover };