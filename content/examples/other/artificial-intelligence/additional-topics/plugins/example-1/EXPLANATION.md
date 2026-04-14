# Plug-In Manifest and Registry System

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `enum`).

## What This Demonstrates

This example implements a plug-in manifest and registry system that defines plug-in capabilities (tools with input/output schemas), manages permission-based tool activation, checks host compatibility, and provides a unified tool discovery interface for LLM agents.

## Code Walkthrough

### Key Classes

- **`PermissionLevel`** (Enum): Defines four permission levels: READ, WRITE, EXECUTE, NETWORK.
- **`ToolManifest`** (dataclass): Describes a single tool with `name`, `description`, `input_schema` (JSON Schema for validation), and `output_schema`.
- **`PluginManifest`** (dataclass): Describes a complete plug-in with `plugin_id`, `name`, `version`, `description`, list of `tools`, `required_permissions`, `host_compatibility` (semver range), and `author`.
- **`PluginRegistry`**: The core registry managing plug-in registration, activation with selective permissions, tool discovery, and permission checking.

### Key Methods

1. **`register(manifest)`**: Registers a plug-in after checking host compatibility and version ordering. Rejects registrations that are not upgrades over existing versions.
2. **`activate(plugin_id, granted_permissions)`**: Activates a plug-in with a specific set of granted permissions. Filters the plug-in's required permissions against the granted set, tracking which permissions were denied.
3. **`get_available_tools()`**: Returns all tools from all active plug-ins in a unified format for LLM discovery. Each tool includes its plugin_id, name, description, and schemas.
4. **`check_permission(plugin_id, required_permission)`**: Checks whether a specific plug-in has a particular permission granted.

### Execution Flow

1. **`main()`** creates a registry with host version 2.0.0.
2. Two plug-ins are registered:
   - **GitHub Plugin** (v1.2.0): Provides `search_repositories` and `create_issue` tools, requires read and write permissions.
   - **Database Plugin** (v0.9.0): Provides `query_table` tool, requires only read permission.
3. Both plug-ins are activated with selective permissions: GitHub gets read+write, Database gets read-only.
4. Available tools are listed for LLM discovery.
5. Permission checks demonstrate that GitHub has write access but Database does not.
6. Denied permissions are displayed for each active plug-in.

### Important Variables

- `self.registered_plugins`: Dictionary of all registered plug-in manifests keyed by plugin_id.
- `self.active_plugins`: Dictionary of activated plug-ins with their granted and denied permissions.
- `host_compatibility`: Semver compatibility string (e.g., ">=1.0.0") ensuring plug-ins work with the host version.
- `input_schema`/`output_schema`: JSON Schema definitions that enable automatic input validation and output verification.

## Key Takeaways

- Plug-in manifests with structured schemas (input/output schemas, permissions, compatibility) enable safe, discoverable, and composable tool ecosystems.
- Permission-based activation ensures that plug-ins only access the resources they need -- the principle of least privilege applied to AI tool usage.
- Host compatibility checking prevents plug-ins from running against incompatible host versions, reducing runtime errors.
- The unified tool discovery interface (`get_available_tools()`) provides LLM agents with all available tools and their descriptions for dynamic tool selection.
- Production plug-in systems add version negotiation, dependency resolution between plug-ins, sandboxed execution, and rate limiting per plug-in.
