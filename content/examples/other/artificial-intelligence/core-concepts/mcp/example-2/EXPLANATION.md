# Example 2: MCP Host — Connecting to Multiple MCP Servers

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only the Python standard library (`typing`, `json`).

---

## What This Demonstrates

This example implements an **MCP Host** — the client-side component that connects to multiple MCP servers, discovers their combined capabilities, and routes tool calls to the correct server. It simulates two servers (a `database-server` and a `search-server`), shows how the host builds a unified tool registry, and demonstrates automatic routing so an LLM can call any tool without knowing which server provides it.

---

## Code Walkthrough

### Key Classes & Variables

| Symbol | Type | Purpose |
|---|---|---|
| `MockMCPServer` | class | A simulated MCP server with a name, resources, tools, and a callable handler per tool. |
| `MockMCPServer.name` | str | Unique identifier for the server (e.g. `"database-server"`). |
| `MockMCPServer._resources` | list[dict] | Resources this server exposes. |
| `MockMCPServer._tools` | list[dict] | Tools this server offers, each with a `handler` lambda for execution. |
| `MockMCPServer._data` | dict | Resource URI → data string mapping. |
| `MCPHost` | class | The host that orchestrates connections, discovery, and routing. |
| `MCPHost.servers` | dict[str, MockMCPServer] | Registry of connected servers keyed by name. |
| `MCPHost._tool_to_server` | dict[str, str] | Reverse index: tool name → server name (built during discovery). |
| `MCPHost._resource_to_server` | dict[str, str] | Reverse index: resource URI → server name. |

### Execution Flow (Step-by-Step)

1. **`main()` starts** — creates an `MCPHost` instance.
2. **Creates `db_server`** (`MockMCPServer`):
   - Resources: `db://users` (Users), `db://orders` (Orders).
   - Tools: `query_users` with a handler that returns a hardcoded user list.
3. **Creates `search_server`** (`MockMCPServer`):
   - Resources: `web://docs` (Documentation).
   - Tools: `web_search` (returns a fake search result) and `fetch_url` (returns fake URL content).
4. **`host.connect(db_server)`**:
   - Calls `server.initialize()` → prints server info.
   - Calls `server.list_resources()` → maps each resource URI to `"database-server"` in `_resource_to_server`.
   - Calls `server.list_tools()` → maps each tool name to `"database-server"` in `_tool_to_server`.
   - Stores server in `self.servers`.
   - Prints discovered resources and tools.
5. **`host.connect(search_server)`** — repeats the same discovery flow, populating mappings for `"search-server"`.
6. **`host.get_discovery_report()`** — returns a summary dict showing connected servers, total tool/resource counts, and the full tool/resource → server mappings. Printed as formatted JSON.
7. **`host.call_tool("query_users", {...})`**:
   - Looks up `"query_users"` in `_tool_to_server` → finds `"database-server"`.
   - Retrieves the server object and calls `server.call_tool("query_users", arguments)`.
   - Inside `MockMCPServer.call_tool()`: finds the tool by name, invokes its `handler` lambda with the arguments, returns `{"users": [...]}`.
   - Prints the result.
8. **`host.call_tool("web_search", {...})`** — same routing logic, resolves to `"search-server"`, executes the `web_search` handler lambda, returns `{"results": [...]}`.
9. **`host.read_resource("db://users")`**:
   - Looks up `"db://users"` in `_resource_to_server` → finds `"database-server"`.
   - Retrieves data from `servers["database-server"]._data["db://users"]`.
   - Prints the data string.

### Important Design Details

- **Tool handlers are lambdas** stored inside each tool dict on `MockMCPServer`. When `call_tool()` executes, it resolves the tool and invokes `tool["handler"](**arguments)`.
- **Discovery builds two reverse indexes** (`_tool_to_server` and `_resource_to_server`) so the host can route any tool or resource request in O(1) lookup time.
- **`get_all_tools()`** aggregates tools from every connected server — this is the list you would pass to an LLM's function-calling API so the model sees one unified tool catalog.

---

## Key Takeaways

- **The Host is the orchestrator** — it sits between the LLM and multiple MCP servers, providing a single interface. The LLM never talks to servers directly; it calls tools through the host, which handles routing transparently.
- **Capability discovery is automatic** — on `connect()`, the host initializes the server, lists all resources and tools, and builds reverse-index mappings. Adding a new server requires zero routing configuration.
- **Tool names must be unique across servers** — the `_tool_to_server` dict uses tool name as key. If two servers register the same tool name, the later one overwrites the earlier mapping.
- **Unified tool catalog for LLMs** — `get_all_tools()` merges tools from all servers into one list, which is exactly what you feed to an LLM's function-calling API. The model sees a single coherent tool set regardless of backend topology.
- **Separation of concerns** — `MockMCPServer` owns data and execution logic; `MCPHost` owns connection management, discovery, and routing. This mirrors real-world MCP architecture where the host is a distinct process from the servers it manages.
