"""
Example 1: Plug-In Manifest and Registry System

Demonstrates:
- Plug-in manifest with capabilities, permissions, and schemas
- Plug-in registry for discovery and compatibility checking
- Permission-based tool activation
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum


class PermissionLevel(Enum):
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"
    NETWORK = "network"


@dataclass
class ToolManifest:
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]


@dataclass
class PluginManifest:
    plugin_id: str
    name: str
    version: str
    description: str
    tools: List[ToolManifest]
    required_permissions: List[str]
    host_compatibility: str  # semver range
    author: str = ""


class PluginRegistry:
    """Manages plug-in discovery, compatibility, and activation."""

    def __init__(self, host_version: str = "2.0.0"):
        self.host_version = host_version
        self.registered_plugins: Dict[str, PluginManifest] = {}
        self.active_plugins: Dict[str, Dict] = {}  # plugin_id → granted permissions
        self.granted_permissions: Dict[str, List[str]] = {}

    def register(self, manifest: PluginManifest) -> bool:
        """Register a plug-in after compatibility check."""
        # Check host compatibility
        if not self._is_compatible(manifest.host_compatibility):
            return False

        # Check for duplicate plugin IDs
        if manifest.plugin_id in self.registered_plugins:
            existing = self.registered_plugins[manifest.plugin_id]
            if manifest.version <= existing.version:
                return False  # Not an upgrade

        self.registered_plugins[manifest.plugin_id] = manifest
        return True

    def activate(self, plugin_id: str, granted_permissions: List[str]) -> bool:
        """Activate a plug-in with specific granted permissions."""
        if plugin_id not in self.registered_plugins:
            return False

        manifest = self.registered_plugins[plugin_id]
        # Filter requested permissions to only granted ones
        active_perms = [p for p in manifest.required_permissions if p in granted_permissions]
        denied = [p for p in manifest.required_permissions if p not in granted_permissions]

        self.active_plugins[plugin_id] = {
            "manifest": manifest,
            "granted_permissions": active_perms,
            "denied_permissions": denied,
        }
        self.granted_permissions[plugin_id] = active_perms
        return True

    def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get all tools from active plug-ins for LLM discovery."""
        tools = []
        for plugin_id, plugin_data in self.active_plugins.items():
            manifest = plugin_data["manifest"]
            for tool in manifest.tools:
                tools.append({
                    "plugin_id": plugin_id,
                    "tool_name": tool.name,
                    "description": tool.description,
                    "input_schema": tool.input_schema,
                    "output_schema": tool.output_schema,
                })
        return tools

    def check_permission(self, plugin_id: str, required_permission: str) -> bool:
        """Check if a plug-in has a specific permission granted."""
        return required_permission in self.granted_permissions.get(plugin_id, [])

    def _is_compatible(self, required_version: str) -> bool:
        """Check if host version is compatible with plug-in requirements."""
        # Simplified: in production, use semver comparison
        return True


def main():
    registry = PluginRegistry(host_version="2.0.0")

    # Register plug-ins
    github_plugin = PluginManifest(
        plugin_id="github-plugin",
        name="GitHub Integration",
        version="1.2.0",
        description="Search repos, create issues, manage PRs",
        tools=[
            ToolManifest(
                name="search_repositories",
                description="Search GitHub repositories by query",
                input_schema={"type": "object", "properties": {"query": {"type": "string"}}},
                output_schema={"type": "object", "properties": {"results": {"type": "array"}}},
            ),
            ToolManifest(
                name="create_issue",
                description="Create a new GitHub issue in a repository",
                input_schema={"type": "object", "properties": {"repo": {"type": "string"}, "title": {"type": "string"}, "body": {"type": "string"}}},
                output_schema={"type": "object", "properties": {"issue_url": {"type": "string"}}},
            ),
        ],
        required_permissions=["read", "write"],
        host_compatibility=">=1.0.0",
    )

    db_plugin = PluginManifest(
        plugin_id="db-plugin",
        name="Database Query",
        version="0.9.0",
        description="Query databases with read-only access",
        tools=[
            ToolManifest(
                name="query_table",
                description="Execute a SELECT query on a database table",
                input_schema={"type": "object", "properties": {"table": {"type": "string"}, "where": {"type": "object"}}},
                output_schema={"type": "object", "properties": {"rows": {"type": "array"}}},
            ),
        ],
        required_permissions=["read"],
        host_compatibility=">=1.5.0",
    )

    registry.register(github_plugin)
    registry.register(db_plugin)

    # Activate with selective permissions
    registry.activate("github-plugin", ["read", "write"])
    registry.activate("db-plugin", ["read"])  # Note: db_plugin only needs read

    print("=== Plug-In Registry Demo ===\n")
    print(f"Registered plugins: {len(registry.registered_plugins)}")
    print(f"Active plugins: {len(registry.active_plugins)}")

    print(f"\nAvailable Tools for LLM:")
    for tool in registry.get_available_tools():
        print(f"  [{tool['plugin_id']}] {tool['tool_name']}: {tool['description'][:50]}")

    print(f"\nPermission Check:")
    print(f"  github-plugin has 'write': {registry.check_permission('github-plugin', 'write')}")
    print(f"  db-plugin has 'write': {registry.check_permission('db-plugin', 'write')}")

    # Show denied permissions
    for plugin_id, data in registry.active_plugins.items():
        if data["denied_permissions"]:
            print(f"\n  {plugin_id} denied: {data['denied_permissions']}")


if __name__ == "__main__":
    main()
