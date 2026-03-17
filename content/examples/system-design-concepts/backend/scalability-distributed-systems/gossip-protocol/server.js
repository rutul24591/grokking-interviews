function gossip(node, peers) {
  const peer = peers[Math.floor(Math.random() * peers.length)];
  send(peer, { membership: node.membership, heartbeat: node.heartbeat });
}

setInterval(() => gossip(localNode, peers), 1000);
