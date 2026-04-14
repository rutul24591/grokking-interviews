# Example 1: Minimal MCP Server Implementation

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only the Python standard library (`json`, `sys`, `typing`).

---

## What This Demonstrates

This example shows how to build a minimal MCP (Model Context Protocol) server from scratch using plain Python. It exposes two database-like resources (`db://users` and `db://orders`) and two query tools (`query_users`, `query_orders`), handling all communication through JSON-RPC over stdio. The demo proves you do not need a framework to implement an MCP server — just a request router, a data store, and stdio transport.

---

## Code Walkthrough

### Key Classes & Variables

| Symbol | Type | Purpose |
|---|---|---|
| `MCPServer` | class | The core server that handles JSON-RPC requests, exposes resources, and executes tools. |
| `MCPServer.resources` | list[dict] | Registry of discoverable resources, each with a `uri`, `name`, `description`, and `mimeType`. |
| `MCPServer.tools` | list[dict] | Registry of discoverable tools, each with a `name`, `description`, and JSON Schema `inputSchema`. |
| `MCPServer._data` | dict | In-memory simulated database keyed by resource URI (e.g. `"db://users"`). |
| `MCPServer.initialized` | bool | Flag set to `True` after the `initialize` handshake. |
| `handle_request()` | method | Main dispatcher — inspects `method` field and delegates to the appropriate handler. |
| `_result()` / `_error()` | methods | Helpers that construct well-formed JSON-RPC response envelopes. |

### Execution Flow (Step-by-Step)

1. **`main()` starts** — instantiates `MCPServer`.
2. **Demo requests array** is defined containing 5 JSON-RPC requests:
   - `initialize` — protocol version handshake.
   - `resources/list` — asks the server what resources it exposes.
   - `tools/list` — asks the server what tools it exposes.
   - `tools/call` — invokes `query_users` with filter `{status: "active"}`.
   - `resources/read` — reads the full `db://orders` resource.
3. For each request, `main()` calls `server.handle_request(req)`:
   - `handle_request()` extracts `method`, `id`, and `params`.
   - It matches the method string to an internal handler via `elif` chain.
4. **`_handle_initialize()`** sets `self.initialized = True` and returns protocol version `2024-11-05`, advertised capabilities (`resources` + `tools`), and server metadata.
5. **`_handle_resources_list()`** returns the `self.resources` array as-is.
6. **`_handle_tools_list()`** returns the `self.tools` array as-is.
7. **`_handle_tools_call()`** — looks up the tool name from `params["name"]`:
   - For `query_users`: retrieves data from `self._data["db://users"]`, applies filter dict by checking `all(u.get(k) == v for k, v in filters.items())`, applies `limit`, and returns JSON-serialized results.
   - For `query_orders`: same logic against `self._data["db://orders"]`.
   - Unknown tool names return a JSON-RPC error with code `-32000`.
8. **`_handle_resources_read()`** — looks up `params["uri"]` in `self._data`. If found, wraps the data in a `contents` array with `uri`, `mimeType`, and `text` (JSON-serialized). If not found, returns error.
9. Each response is printed to stdout with the method name and a truncated JSON result.

### Helper Methods

- **`_result(request_id, result)`** → returns `{"jsonrpc": "2.0", "id": request_id, "result": result}`.
- **`_error(request_id, code, message)`** → returns `{"jsonrpc": "2.0", "id": request_id, "error": {"code": code, "message": message}}`.

---

## Key Takeaways

- **MCP is transport-agnostic** — this example uses stdio (stdin/stdout) but the same JSON-RPC logic works over HTTP, WebSockets, or any byte stream.
- **Resources and tools are self-describing** — every resource has a URI, name, description, and MIME type; every tool has a name, description, and JSON Schema. An LLM client discovers capabilities through `resources/list` and `tools/list` before calling anything.
- **JSON-RPC envelope is minimal** — every request and response carries `jsonrpc: "2.0"`, an `id` for correlation, and either `result` (success) or `error` (failure with code + message).
- **Tool execution is just filtered data access** — the `query_users` and `query_orders` handlers demonstrate that tools are essentially parameterized functions with typed input schemas and structured text output.
- **No framework required** — the entire server is ~150 lines of plain Python, proving the MCP protocol is simple enough to implement without any SDK.
