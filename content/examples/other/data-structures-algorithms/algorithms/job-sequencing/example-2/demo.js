console.log("Optimization: use a DSU where parent[t] points to the next available slot <= t.");
console.log("After scheduling a job at t, union(t, t-1) so future lookups skip filled slots.");
