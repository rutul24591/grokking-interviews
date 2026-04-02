type Option = "postgres" | "dynamodb" | "cassandra";
type Criterion = "consistency" | "operability" | "scalability";

const weights: Record<Criterion, number> = { consistency: 0.4, operability: 0.3, scalability: 0.3 };
const scores: Record<Option, Record<Criterion, number>> = {
  postgres: { consistency: 9, operability: 8, scalability: 6 },
  dynamodb: { consistency: 6, operability: 9, scalability: 9 },
  cassandra: { consistency: 5, operability: 6, scalability: 9 }
};

function total(o: Option) {
  return (Object.keys(weights) as Criterion[]).reduce((acc, c) => acc + weights[c] * scores[o][c], 0);
}

const ranked = (Object.keys(scores) as Option[])
  .map((o) => ({ option: o, total: Math.round(total(o) * 100) / 100 }))
  .sort((a, b) => b.total - a.total);

console.log(JSON.stringify({ weights, ranked }, null, 2));

