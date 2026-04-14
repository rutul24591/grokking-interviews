"""
Example 1: Minimal MCP Server Implementation

Demonstrates:
- Building an MCP server that exposes resources and tools
- JSON-RPC protocol handling
- Resource discovery and reading
- Tool definition and execution
- stdio transport layer
"""

import json
import sys
from typing import Dict, Any, Optional


class MCPServer:
    """
    Minimal MCP server implementation using stdio transport.
    Exposes database-like resources and query tools.
    """

    def __init__(self):
        self.initialized = False
        self.resources = [
            {
                "uri": "db://users",
                "name": "Users Table",
                "description": "User accounts with id, name, email, status",
                "mimeType": "application/json",
            },
            {
                "uri": "db://orders",
                "name": "Orders Table",
                "description": "Customer orders with id, user_id, amount, status",
                "mimeType": "application/json",
            },
        ]
        self.tools = [
            {
                "name": "query_users",
                "description": (
                    "Query the users table. Use when you need to find user information "
                    "by name, email, or status. Arguments: filters (dict with optional "
                    "keys: name, email, status), limit (int, default 10). "
                    "Returns: list of user objects with id, name, email, status."
                ),
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "filters": {
                            "type": "object",
                            "description": "Filter criteria. Keys: name, email, status",
                        },
                        "limit": {
                            "type": "integer",
                            "description": "Max results to return (default 10)",
                        },
                    },
                },
            },
            {
                "name": "query_orders",
                "description": (
                    "Query the orders table. Use when you need to find order information "
                    "by user_id, status, or amount range. Arguments: filters (dict with "
                    "optional keys: user_id, status, min_amount, max_amount), limit (int, default 10). "
                    "Returns: list of order objects with id, user_id, amount, status, created_at."
                ),
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "filters": {"type": "object"},
                        "limit": {"type": "integer"},
                    },
                },
            },
        ]
        # Simulated data
        self._data = {
            "db://users": [
                {"id": 1, "name": "Alice", "email": "alice@example.com", "status": "active"},
                {"id": 2, "name": "Bob", "email": "bob@example.com", "status": "inactive"},
                {"id": 3, "name": "Charlie", "email": "charlie@example.com", "status": "active"},
            ],
            "db://orders": [
                {"id": 101, "user_id": 1, "amount": 49.99, "status": "completed", "created_at": "2024-01-15"},
                {"id": 102, "user_id": 1, "amount": 120.00, "status": "pending", "created_at": "2024-02-01"},
                {"id": 103, "user_id": 2, "amount": 75.50, "status": "completed", "created_at": "2024-01-20"},
            ],
        }

    def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle an incoming JSON-RPC request."""
        method = request.get("method")
        request_id = request.get("id")
        params = request.get("params", {})

        if method == "initialize":
            return self._handle_initialize(request_id)
        elif method == "resources/list":
            return self._handle_resources_list(request_id)
        elif method == "resources/read":
            return self._handle_resources_read(request_id, params)
        elif method == "tools/list":
            return self._handle_tools_list(request_id)
        elif method == "tools/call":
            return self._handle_tools_call(request_id, params)
        else:
            return self._error(request_id, -32601, f"Method not found: {method}")

    def _handle_initialize(self, request_id) -> Dict:
        self.initialized = True
        return self._result(request_id, {
            "protocolVersion": "2024-11-05",
            "capabilities": {"resources": {}, "tools": {}},
            "serverInfo": {"name": "demo-db-server", "version": "1.0.0"},
        })

    def _handle_resources_list(self, request_id) -> Dict:
        return self._result(request_id, {"resources": self.resources})

    def _handle_resources_read(self, request_id, params) -> Dict:
        uri = params.get("uri")
        if uri not in self._data:
            return self._error(request_id, -32000, f"Resource not found: {uri}")
        return self._result(request_id, {
            "contents": [{
                "uri": uri,
                "mimeType": "application/json",
                "text": json.dumps(self._data[uri]),
            }]
        })

    def _handle_tools_list(self, request_id) -> Dict:
        return self._result(request_id, {"tools": self.tools})

    def _handle_tools_call(self, request_id, params) -> Dict:
        tool_name = params.get("name")
        arguments = params.get("arguments", {})

        if tool_name == "query_users":
            filters = arguments.get("filters", {})
            limit = arguments.get("limit", 10)
            results = self._data["db://users"]
            if filters:
                results = [u for u in results if all(u.get(k) == v for k, v in filters.items())]
            return self._result(request_id, {
                "content": [{"type": "text", "text": json.dumps(results[:limit])}]
            })
        elif tool_name == "query_orders":
            filters = arguments.get("filters", {})
            limit = arguments.get("limit", 10)
            results = self._data["db://orders"]
            if filters:
                results = [o for o in results if all(o.get(k) == v for k, v in filters.items())]
            return self._result(request_id, {
                "content": [{"type": "text", "text": json.dumps(results[:limit])}]
            })
        else:
            return self._error(request_id, -32000, f"Unknown tool: {tool_name}")

    def _result(self, request_id, result: Dict) -> Dict:
        return {"jsonrpc": "2.0", "id": request_id, "result": result}

    def _error(self, request_id, code: int, message: str) -> Dict:
        return {"jsonrpc": "2.0", "id": request_id, "error": {"code": code, "message": message}}


def main():
    """
    Run the MCP server using stdio transport.
    Reads JSON-RPC requests from stdin, writes responses to stdout.
    """
    server = MCPServer()

    # Demo: process a few requests
    demo_requests = [
        {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05"}},
        {"jsonrpc": "2.0", "id": 2, "method": "resources/list", "params": {}},
        {"jsonrpc": "2.0", "id": 3, "method": "tools/list", "params": {}},
        {"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "query_users", "arguments": {"filters": {"status": "active"}}}},
        {"jsonrpc": "2.0", "id": 5, "method": "resources/read", "params": {"uri": "db://orders"}},
    ]

    print("=== MCP Server Demo ===\n")
    for req in demo_requests:
        print(f"Request: {req['method']}")
        response = server.handle_request(req)
        result_str = json.dumps(response.get("result", response.get("error", {})), indent=2)
        print(f"Response: {result_str[:200]}...\n")


if __name__ == "__main__":
    main()
