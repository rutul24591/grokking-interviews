"""
Example 2: MCP Host — Connecting to Multiple MCP Servers

Demonstrates:
- MCP host implementation that connects to servers
- Capability discovery and aggregation
- Tool call routing to the correct server
- Unified tool interface from multiple servers
"""

from typing import Dict, List, Any, Optional
import json


class MockMCPServer:
    """Simulated MCP server for demonstration."""

    def __init__(self, name: str, resources: List[Dict], tools: List[Dict]):
        self.name = name
        self._resources = resources
        self._tools = tools
        self._data = {r["uri"]: f"Data from {r['name']}" for r in resources}

    def initialize(self) -> Dict:
        return {
            "protocolVersion": "2024-11-05",
            "capabilities": {"resources": {}, "tools": {}},
            "serverInfo": {"name": self.name, "version": "1.0.0"},
        }

    def list_resources(self) -> List[Dict]:
        return self._resources

    def list_tools(self) -> List[Dict]:
        return [{"name": t["name"], "description": t["description"], "inputSchema": t["inputSchema"]} for t in self._tools]

    def call_tool(self, name: str, arguments: Dict) -> Dict:
        tool = next((t for t in self._tools if t["name"] == name), None)
        if not tool:
            return {"error": f"Tool '{name}' not found in {self.name}"}
        return tool.get("handler", lambda **_: {"result": "ok"})(**arguments)


class MCPHost:
    """
    MCP Host that connects to multiple servers, discovers their capabilities,
    and routes tool calls to the appropriate server.
    """

    def __init__(self):
        self.servers: Dict[str, MockMCPServer] = {}
        self._tool_to_server: Dict[str, str] = {}  # tool_name -> server_name
        self._resource_to_server: Dict[str, str] = {}  # resource_uri -> server_name

    def connect(self, server: MockMCPServer) -> None:
        """Connect to an MCP server and discover its capabilities."""
        # Initialize
        init_response = server.initialize()
        print(f"  Connected to {server.name}: {init_response['serverInfo']}")

        # Discover resources
        resources = server.list_resources()
        for r in resources:
            self._resource_to_server[r["uri"]] = server.name

        # Discover tools
        tools = server.list_tools()
        for t in tools:
            self._tool_to_server[t["name"]] = server.name

        self.servers[server.name] = server
        print(f"    Resources: {[r['uri'] for r in resources]}")
        print(f"    Tools: {[t['name'] for t in tools]}")

    def get_all_tools(self) -> List[Dict]:
        """Get aggregated tool list from all connected servers (for LLM prompt)."""
        all_tools = []
        for server in self.servers.values():
            all_tools.extend(server.list_tools())
        return all_tools

    def call_tool(self, tool_name: str, arguments: Dict) -> Dict:
        """Route a tool call to the appropriate server."""
        server_name = self._tool_to_server.get(tool_name)
        if not server_name:
            return {"error": f"Tool '{tool_name}' not found in any connected server"}
        server = self.servers[server_name]
        print(f"  Routing '{tool_name}' to server: {server_name}")
        return server.call_tool(tool_name, arguments)

    def read_resource(self, uri: str) -> Optional[str]:
        """Route a resource read to the appropriate server."""
        server_name = self._resource_to_server.get(uri)
        if not server_name:
            return None
        return self.servers[server_name]._data.get(uri)

    def get_discovery_report(self) -> Dict[str, Any]:
        """Report on discovered capabilities."""
        return {
            "connected_servers": list(self.servers.keys()),
            "total_tools": len(self._tool_to_server),
            "total_resources": len(self._resource_to_server),
            "tool_mapping": self._tool_to_server,
            "resource_mapping": self._resource_to_server,
        }


def main():
    host = MCPHost()

    # Create simulated MCP servers
    db_server = MockMCPServer(
        name="database-server",
        resources=[
            {"uri": "db://users", "name": "Users", "description": "User accounts", "mimeType": "application/json"},
            {"uri": "db://orders", "name": "Orders", "description": "Customer orders", "mimeType": "application/json"},
        ],
        tools=[
            {
                "name": "query_users",
                "description": "Search users by name, email, or status.",
                "inputSchema": {"type": "object", "properties": {"filters": {"type": "object"}}},
                "handler": lambda filters=None: {"users": [{"id": 1, "name": "Alice", "status": "active"}]},
            },
        ],
    )

    search_server = MockMCPServer(
        name="search-server",
        resources=[
            {"uri": "web://docs", "name": "Documentation", "description": "Company docs", "mimeType": "text/html"},
        ],
        tools=[
            {
                "name": "web_search",
                "description": "Search the web for information.",
                "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}}},
                "handler": lambda query: {"results": [{"title": f"Result for '{query}'", "url": "https://..."}]},
            },
            {
                "name": "fetch_url",
                "description": "Fetch and extract content from a URL.",
                "inputSchema": {"type": "object", "properties": {"url": {"type": "string"}}},
                "handler": lambda url: {"content": f"Content from {url}"},
            },
        ],
    )

    print("=== MCP Host Discovery ===\n")
    host.connect(db_server)
    print()
    host.connect(search_server)

    print(f"\n=== Discovery Report ===")
    report = host.get_discovery_report()
    print(json.dumps(report, indent=2))

    print(f"\n=== Tool Call Routing ===")
    result1 = host.call_tool("query_users", {"filters": {"status": "active"}})
    print(f"  Result: {result1}")

    result2 = host.call_tool("web_search", {"query": "Q3 revenue"})
    print(f"  Result: {result2}")

    print(f"\n=== Resource Access ===")
    data = host.read_resource("db://users")
    print(f"  db://users: {data}")


if __name__ == "__main__":
    main()
