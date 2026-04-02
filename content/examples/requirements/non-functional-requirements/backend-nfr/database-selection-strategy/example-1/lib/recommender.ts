export type WorkloadProfile = {
  readsPerSecond: number;
  writesPerSecond: number;
  maxP95LatencyMs: number;
  requiresStrongConsistency: boolean;
  needsFullTextSearch: boolean;
  needsGraphQueries: boolean;
  dataSizeGb: number;
  multiRegion: boolean;
};

export type Candidate = "postgres" | "dynamodb" | "cassandra" | "elasticsearch" | "redis" | "neo4j";

export type Recommendation = {
  primary: Candidate;
  ranked: { candidate: Candidate; score: number; reasons: string[] }[];
};

function score(profile: WorkloadProfile, c: Candidate) {
  let s = 0;
  const reasons: string[] = [];

  const highWrite = profile.writesPerSecond > 5_000;
  const highRead = profile.readsPerSecond > 10_000;
  const lowLatency = profile.maxP95LatencyMs <= 20;

  if (c === "elasticsearch") {
    if (profile.needsFullTextSearch) {
      s += 90;
      reasons.push("native full-text search and relevance scoring");
    } else {
      s -= 30;
      reasons.push("unnecessary operational complexity without search requirement");
    }
    if (profile.requiresStrongConsistency) {
      s -= 10;
      reasons.push("not ideal for strict transactional consistency as a primary store");
    }
  }

  if (c === "postgres") {
    s += profile.requiresStrongConsistency ? 30 : 10;
    reasons.push(profile.requiresStrongConsistency ? "strong transactions (ACID)" : "good default for OLTP");
    if (highWrite) {
      s -= 10;
      reasons.push("may need sharding/partitioning for very high write throughput");
    }
  }

  if (c === "dynamodb") {
    if (highWrite || highRead) {
      s += 30;
      reasons.push("managed horizontal scaling for high throughput");
    }
    if (profile.requiresStrongConsistency) {
      s -= 5;
      reasons.push("strong reads exist but cost/latency trade-offs apply");
    }
    if (profile.needsGraphQueries) {
      s -= 20;
      reasons.push("poor fit for graph traversals");
    }
  }

  if (c === "cassandra") {
    if (profile.multiRegion && highWrite) {
      s += 25;
      reasons.push("multi-region write scalability patterns (eventual/tuples) fit");
    }
    if (profile.requiresStrongConsistency) {
      s -= 25;
      reasons.push("eventual/tunable consistency; not strict ACID");
    }
  }

  if (c === "redis") {
    if (lowLatency) {
      s += 25;
      reasons.push("in-memory low-latency access");
    }
    if (profile.dataSizeGb > 50) {
      s -= 30;
      reasons.push("expensive at large dataset sizes unless carefully scoped");
    }
    reasons.push("best as cache/ephemeral store, not primary source of truth");
  }

  if (c === "neo4j") {
    if (profile.needsGraphQueries) {
      s += 80;
      reasons.push("native graph traversals and relationship queries");
    } else {
      s -= 30;
      reasons.push("specialized; avoid unless graph queries are core");
    }
  }

  // Cross-cutting weight: large datasets benefit from partition-friendly systems.
  if (profile.dataSizeGb > 500 && (c === "postgres" || c === "redis")) {
    s -= 15;
    reasons.push("large dataset size increases operational risk for this choice");
  }

  return { score: s, reasons };
}

export function recommend(profile: WorkloadProfile): Recommendation {
  const candidates: Candidate[] = ["postgres", "dynamodb", "cassandra", "elasticsearch", "redis", "neo4j"];
  const ranked = candidates
    .map((c) => ({ candidate: c, ...score(profile, c) }))
    .sort((a, b) => b.score - a.score);
  return { primary: ranked[0]!.candidate, ranked };
}

