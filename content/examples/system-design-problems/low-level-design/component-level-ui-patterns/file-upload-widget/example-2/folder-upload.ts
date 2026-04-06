/**
 * Drag-Drop Folder Upload — Handles folder drag-and-drop with recursive file extraction.
 *
 * Interview edge case: When a user drags a folder onto the upload zone,
 * DataTransfer.files is a flat list. We need to reconstruct the folder hierarchy
 * using webkitRelativePath (available when folder is dropped with directory support).
 */

export interface FileTree {
  name: string;
  type: 'file' | 'folder';
  children?: FileTree[];
  file?: File;
  path: string;
}

/**
 * Builds a file tree from a FileList, reconstructing folder hierarchy from webkitRelativePath.
 */
export function buildFileTree(files: FileList | File[]): FileTree[] {
  const root: FileTree[] = [];
  const pathMap = new Map<string, FileTree>();

  for (const file of Array.from(files)) {
    // For folder drops, webkitRelativePath contains the full path
    const relativePath = (file as any).webkitRelativePath || file.name;
    const parts = relativePath.split('/');

    let currentPath = '';
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (pathMap.has(currentPath)) {
        currentLevel = pathMap.get(currentPath)!.children || [];
        continue;
      }

      const isFile = i === parts.length - 1;
      const node: FileTree = {
        name: part,
        type: isFile ? 'file' : 'folder',
        path: currentPath,
        ...(isFile ? { file } : { children: [] }),
      };

      pathMap.set(currentPath, node);
      currentLevel.push(node);
      currentLevel = node.children || [];
    }
  }

  return root;
}

/**
 * Flattens a file tree back into a list of files for upload.
 */
export function flattenFileTree(tree: FileTree[]): File[] {
  const files: File[] = [];
  function traverse(nodes: FileTree[]) {
    for (const node of nodes) {
      if (node.type === 'file' && node.file) files.push(node.file);
      if (node.children) traverse(node.children);
    }
  }
  traverse(tree);
  return files;
}
