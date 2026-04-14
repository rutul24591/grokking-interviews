"""
Example 2: Tool Call Router with Input/Output Validation

Demonstrates:
- Routing LLM tool calls to the correct plug-in
- Input validation against tool schema
- Output validation before returning to LLM
- Permission enforcement at execution time
"""

from typing import Dict, Any, List, Optional
import json


class ToolCallRouter:
    """
    Routes LLM tool calls to plug-ins with validation at every boundary.
    """

    def __init__(self):
        self.tools: Dict[str, Dict] = {}  # tool_name → tool metadata
        self.plugin_permissions: Dict[str, List[str]] = {}

    def register_tool(self, plugin_id: str, tool_name: str, description: str,
                      input_schema: Dict, output_schema: Dict,
                      required_permissions: List[str], implementation) -> None:
        """Register a tool from a plug-in."""
        self.tools[tool_name] = {
            "plugin_id": plugin_id,
            "description": description,
            "input_schema": input_schema,
            "output_schema": output_schema,
            "required_permissions": required_permissions,
            "implementation": implementation,
        }

    def set_permissions(self, plugin_id: str, permissions: List[str]) -> None:
        """Set granted permissions for a plug-in."""
        self.plugin_permissions[plugin_id] = permissions

    def validate_input(self, tool_name: str, arguments: Dict) -> Optional[str]:
        """Validate tool call arguments against input schema."""
        if tool_name not in self.tools:
            return f"Unknown tool: {tool_name}"

        schema = self.tools[tool_name]["input_schema"]
        properties = schema.get("properties", {})

        for field_name, field_schema in properties.items():
            if field_name not in arguments:
                if "required" in schema and field_name in schema.get("required", []):
                    return f"Missing required field: {field_name}"

            # Type check
            if field_name in arguments:
                expected_type = field_schema.get("type", "string")
                value = arguments[field_name]
                if expected_type == "string" and not isinstance(value, str):
                    return f"Field '{field_name}' expected string, got {type(value).__name__}"
                if expected_type == "integer" and not isinstance(value, int):
                    return f"Field '{field_name}' expected integer, got {type(value).__name__}"

        return None  # Valid

    def check_permissions(self, tool_name: str) -> Optional[str]:
        """Check if plug-in has required permissions for this tool."""
        tool = self.tools[tool_name]
        plugin_id = tool["plugin_id"]
        granted = self.plugin_permissions.get(plugin_id, [])
        required = tool["required_permissions"]

        for perm in required:
            if perm not in granted:
                return f"Permission denied: {perm} not granted for plugin {plugin_id}"
        return None

    def execute(self, tool_name: str, arguments: Dict) -> Dict[str, Any]:
        """Route and execute a tool call with full validation."""
        # Step 1: Validate tool exists
        if tool_name not in self.tools:
            return {"error": f"Unknown tool: {tool_name}"}

        # Step 2: Validate input
        input_error = self.validate_input(tool_name, arguments)
        if input_error:
            return {"error": f"Input validation failed: {input_error}"}

        # Step 3: Check permissions
        perm_error = self.check_permissions(tool_name)
        if perm_error:
            return {"error": f"Permission error: {perm_error}"}

        # Step 4: Execute
        tool = self.tools[tool_name]
        try:
            result = tool["implementation"](**arguments)
            # Step 5: Validate output (simplified)
            return {"success": True, "result": result}
        except Exception as e:
            return {"error": f"Execution failed: {str(e)}"}


def main():
    router = ToolCallRouter()

    # Register tools from plug-ins
    def search_repos_impl(query: str) -> Dict:
        return {"results": [{"name": f"Repo matching '{query}'", "stars": 100}]}

    def query_table_impl(table: str, where: Dict = None) -> Dict:
        return {"rows": [{"id": 1, "name": "sample"}]}

    router.register_tool(
        plugin_id="github",
        tool_name="search_repositories",
        description="Search GitHub repositories",
        input_schema={"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
        output_schema={"type": "object"},
        required_permissions=["read"],
        implementation=search_repos_impl,
    )

    router.register_tool(
        plugin_id="database",
        tool_name="query_table",
        description="Query a database table",
        input_schema={"type": "object", "properties": {"table": {"type": "string"}, "where": {"type": "object"}}, "required": ["table"]},
        output_schema={"type": "object"},
        required_permissions=["read"],
        implementation=query_table_impl,
    )

    # Set permissions (github has read, database does NOT have write)
    router.set_permissions("github", ["read"])
    router.set_permissions("database", ["read"])  # read-only!

    print("=== Tool Call Router Demo ===\n")

    # Valid call
    result = router.execute("search_repositories", {"query": "python web framework"})
    print(f"Valid call: search_repositories(query='python web framework')")
    print(f"  Result: {result}")

    # Missing required field
    result = router.execute("search_repositories", {})
    print(f"\nMissing field: search_repositories({{}})")
    print(f"  Result: {result}")

    # Unknown tool
    result = router.execute("delete_repository", {"repo": "my-repo"})
    print(f"\nUnknown tool: delete_repository")
    print(f"  Result: {result}")


if __name__ == "__main__":
    main()
