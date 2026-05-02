function floydWarshall(nodes, edges) {
  const index = new Map(nodes.map((n, i) => [n, i]));
  const dist = Array.from({ length: nodes.length }, () =>
    new Array(nodes.length).fill(Infinity),
  );
  for (let i = 0; i < nodes.length; i += 1) dist[i][i] = 0;
  for (const { from, to, weight } of edges) {
    dist[index.get(from)][index.get(to)] = Math.min(
      dist[index.get(from)][index.get(to)],
      weight,
    );
  }

  for (let k = 0; k < nodes.length; k += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = 0; j < nodes.length; j += 1) {
        const through = dist[i][k] + dist[k][j];
        if (through < dist[i][j]) dist[i][j] = through;
      }
    }
  }

  return dist;
}

module.exports = { floydWarshall };
