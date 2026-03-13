// API server showing pagination, filtering, sorting, and a consistent envelope.

const http = require("http");
const { URL } = require("url");
const { paginate, buildMeta } = require("./pagination");
const { filterOrders } = require("./filters");
const { errorPayload } = require("./errors");

const orders = [
  { id: 1, status: "processing", total: 120, createdAt: "2025-01-03T10:00:00Z" },
  { id: 2, status: "shipped", total: 240, createdAt: "2025-01-05T10:00:00Z" },
  { id: 3, status: "shipped", total: 80, createdAt: "2025-01-06T10:00:00Z" },
  { id: 4, status: "cancelled", total: 45, createdAt: "2025-01-08T10:00:00Z" },
  { id: 5, status: "processing", total: 310, createdAt: "2025-01-09T10:00:00Z" },
  { id: 6, status: "shipped", total: 150, createdAt: "2025-01-10T10:00:00Z" },
];

function parseQuery(url) {
  const limit = Math.min(Number(url.searchParams.get("limit")) || 3, 10);
  const cursor = url.searchParams.get("cursor");
  const status = url.searchParams.get("status") || null;
  const minTotal = url.searchParams.get("minTotal");
  const maxTotal = url.searchParams.get("maxTotal");
  const sort = url.searchParams.get("sort") || null;

  return {
    limit,
    cursor: cursor ? Number(cursor) : null,
    status,
    minTotal: minTotal ? Number(minTotal) : undefined,
    maxTotal: maxTotal ? Number(maxTotal) : undefined,
    sort,
  };
}

function respond(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/orders") {
    const query = parseQuery(url);

    if (query.minTotal && Number.isNaN(query.minTotal)) {
      return respond(res, 400, errorPayload("BAD_REQUEST", "minTotal must be a number"));
    }

    const filtered = filterOrders(orders, query);
    const { slice, nextCursor } = paginate(filtered, query.limit, query.cursor);
    return respond(res, 200, {
      data: slice,
      meta: buildMeta({ limit: query.limit, nextCursor, total: filtered.length }),
    });
  }

  return respond(res, 404, errorPayload("NOT_FOUND", "Route not found"));
});

server.listen(4030, () => {
  console.log("API Design Best Practices demo on http://localhost:4030/orders");
});
