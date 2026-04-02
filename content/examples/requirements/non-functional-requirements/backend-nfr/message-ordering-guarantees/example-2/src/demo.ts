function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function partition(key: string, partitions: number) {
  return hash(key) % partitions;
}

const keys = ["user:1", "user:2", "post:9", "post:10"];
const partitions = 4;

console.log(JSON.stringify({ partitions, mapping: keys.map((k) => ({ key: k, partition: partition(k, partitions) })) }, null, 2));

