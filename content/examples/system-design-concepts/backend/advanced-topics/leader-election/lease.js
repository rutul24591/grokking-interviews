function isLeader(nodeId, lease){
  return lease.owner === nodeId && Date.now() < lease.expires;
}
module.exports = { isLeader };