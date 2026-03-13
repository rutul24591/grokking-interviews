// Longest prefix match.

const routes = [
  { cidr: "10.0.0.0/8", next: "A" },
  { cidr: "10.0.0.0/16", next: "B" },
  { cidr: "0.0.0.0/0", next: "C" },
];

function choose(ip) {
  return routes.sort((a,b)=> parseInt(b.cidr.split("/")[1]) - parseInt(a.cidr.split("/")[1]))[0];
}

console.log(choose("10.0.5.1"));
