// HTTP server implementing a RESTful API for books.

const http = require("http");
const { URL } = require("url");
const { matchRoute } = require("./router");
const handlers = require("./handlers");

const routes = [
  {
    method: "GET",
    pattern: /^\/books$/,
    handler: (req, res) => respond(res, 200, { data: handlers.listBooks() }),
  },
  {
    method: "GET",
    pattern: /^\/books\/(?<id>\d+)$/,
    handler: (req, res, params) => {
      const book = handlers.getBook(Number(params.id));
      if (!book) return respond(res, 404, { error: { code: "NOT_FOUND", message: "Book not found" } });
      return respond(res, 200, { data: book });
    },
  },
  {
    method: "POST",
    pattern: /^\/books$/,
    handler: async (req, res) => {
      const body = await readBody(req);
      const input = body ? JSON.parse(body) : {};
      const result = handlers.createBook(input);
      if (result.error) return respond(res, 400, result.error);
      res.setHeader("Location", `/books/${result.book.id}`);
      return respond(res, 201, { data: result.book });
    },
  },
];

function respond(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString("utf8")));
    req.on("end", () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const match = matchRoute(req.method, url.pathname, routes);
  if (!match) return respond(res, 404, { error: { code: "NOT_FOUND", message: "Route not found" } });
  return match.handler(req, res, match.params);
});

server.listen(4020, () => {
  console.log("REST API running on http://localhost:4020/books");
});
