/**
 * File Explorer — Staff-Level Permission-Based Rendering.
 *
 * Staff differentiator: RBAC-aware file operations, optimistic permission
 * checks before rendering actions, and server-side permission validation
 * with fallback UI for denied operations.
 */

export type FilePermission = 'read' | 'write' | 'delete' | 'share' | 'admin';

export interface FileWithPermissions {
  id: string;
  name: string;
  type: 'file' | 'folder';
  permissions: FilePermission[];
  owner: string;
  modifiedAt: number;
  size?: number;
}

/**
 * Hook that filters file operations based on user permissions.
 */
export function useFilePermissions(
  file: FileWithPermissions,
  userRole: 'viewer' | 'editor' | 'owner',
) {
  const rolePermissions: Record<string, FilePermission[]> = {
    viewer: ['read'],
    editor: ['read', 'write', 'share'],
    owner: ['read', 'write', 'delete', 'share', 'admin'],
  };

  const userPerms = new Set(rolePermissions[userRole]);
  const filePerms = new Set(file.permissions);

  const canRead = userPerms.has('read') && filePerms.has('read');
  const canWrite = userPerms.has('write') && filePerms.has('write');
  const canDelete = userPerms.has('delete') && filePerms.has('delete');
  const canShare = userPerms.has('share') && filePerms.has('share');

  return { canRead, canWrite, canDelete, canShare };
}

/**
 * Server-side permission validator.
 * Verifies that the user has the required permission before executing an operation.
 */
export async function validatePermission(
  fileId: string,
  requiredPermission: FilePermission,
  authToken: string,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const response = await fetch(`/api/files/${fileId}/permissions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      return { allowed: false, reason: 'Failed to check permissions' };
    }

    const data = await response.json();
    if (!data.permissions.includes(requiredPermission)) {
      return { allowed: false, reason: `Missing ${requiredPermission} permission` };
    }

    return { allowed: true };
  } catch {
    return { allowed: false, reason: 'Network error' };
  }
}
