// Zone records for the DNS simulation.

const zones = {
  "com": {
    records: {},
    children: {
      "example": {
        records: {
          "@": { A: "203.0.113.10", TTL: 30 },
          "api": { CNAME: "edge.example.com", TTL: 60 },
          "edge": { A: "203.0.113.11", TTL: 60 },
          "_verify": { TXT: "verification=abc123", TTL: 120 },
        },
        children: {},
      },
    },
  },
};

module.exports = { zones };
