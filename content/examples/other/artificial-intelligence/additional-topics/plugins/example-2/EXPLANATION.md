# Tool Call Router with Input/Output Validation

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`typing`, `json`).

## What This Demonstrates

This example implements a tool call router that sits between an LLM and plug-in tool implementations, enforcing validation at every boundary: validating tool existence, checking input arguments against JSON schemas, verifying permissions before execution, and validating outputs before returning results to the LLM.

## Code Walkthrough

### Key Class

- **`ToolCallRouter`**: The core router that manages tool registration, permission enforcement, input/output validation, and execution routing. Maintains a registry of tools keyed by tool name and a permission map keyed by plugin_id.

### Key Methods

1. **`register_tool(plugin_id, tool_name, description, input_schema, output_schema, required_permissions, implementation)`**: Registers a tool with its full metadata and implementation function. Stores the tool in the router's registry.
2. **`set_permissions(plugin_id, permissions)`**: Sets the granted permissions for a plug-in. Controls which operations the plug-in is authorized to perform.
3. **`validate_input(tool_name, arguments)`**: Validates tool call arguments against the tool's input JSON schema:
   - Checks that all required fields are present.
   - Checks that each argument's type matches the schema (string, integer, etc.).
   - Returns an error string if validation fails, or `None` if valid.
4. **`check_permissions(tool_name)`**: Checks whether the plug-in owning this tool has all required permissions granted. Returns an error string if any permission is missing.
5. **`execute(tool_name, arguments)`**: The main execution entry point with a five-step validation pipeline:
   - Step 1: Verify tool exists in registry.
   - Step 2: Validate input arguments against schema.
   - Step 3: Check plug-in permissions.
   - Step 4: Execute the tool implementation.
   - Step 5: Return validated result (or error at any step).

### Execution Flow

1. **`main()`** creates a router and registers two tools:
   - `search_repositories` (GitHub plugin, requires read permission).
   - `query_table` (Database plugin, requires read permission).
2. Permissions are set: GitHub gets read, Database gets read-only.
3. Three test cases demonstrate the validation pipeline:
   - **Valid call**: `search_repositories(query='python web framework')` -- passes all validations, executes successfully.
   - **Missing required field**: `search_repositories({})` -- fails input validation (query is required).
   - **Unknown tool**: `delete_repository(...)` -- fails tool existence check.

### Important Variables

- `self.tools`: Dictionary mapping tool names to their full metadata including implementation function.
- `self.plugin_permissions`: Dictionary mapping plugin IDs to their granted permission lists.
- Input schema `required` field: Specifies which fields must be present in the arguments.
- Five-step validation pipeline: Each step is a gate -- failure at any step returns an error without proceeding further.

## Key Takeaways

- Validation at every boundary (input, permissions, output) is essential for safe tool execution -- the LLM should never be able to call tools with invalid arguments or unauthorized permissions.
- JSON Schema-based input validation provides automatic, declarative argument checking without writing custom validation code for each tool.
- The five-step validation pipeline ensures fail-fast behavior: errors are caught at the earliest possible stage, preventing unnecessary execution.
- Permission enforcement at the router level (not just the plug-in level) provides a centralized security checkpoint for all tool calls.
- Production tool routers add output schema validation, rate limiting, argument sanitization, execution timeouts, and structured logging for every tool call.
