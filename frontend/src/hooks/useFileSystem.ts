// import { useState } from 'react'
// import { FileNode } from '../types/FileSystem'

// export function useFileSystem() {
//   const [fileStructure, setFileStructure] = useState<FileNode[]>([])
//   const [fileContents, setFileContents] = useState<Record<string, string>>({})
//   const [selectedFile, setSelectedFile] = useState<string | null>(null)

//   const updateFileSystem = (newStructure: FileNode[], newContents: Record<string, string>) => {
//     setFileStructure(newStructure)
//     setFileContents(newContents)
//     setSelectedFile(Object.keys(newContents)[0] || null)
//   }

//   return {
//     fileStructure,
//     fileContents,
//     selectedFile,
//     setSelectedFile,
//     updateFileSystem,
//   }
// }

import { useState, useCallback } from 'react';
import { FileNode } from '../types/FileSystem';

interface FileOperation {
  path: string;
  content?: string;
  type: 'create' | 'update' | 'delete';
  isDirectory?: boolean;
}

export function useFileSystem() {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Helper to create file structure from path
  const createFileStructure = useCallback((path: string, isDirectory: boolean): FileNode => {
    const parts = path.split('/').filter(Boolean);
    const name = parts[parts.length - 1];
    
    return {
      id: path,
      name,
      path,
      isDirectory,
      children: [],
    };
  }, []);

  // Helper to insert node into tree structure
  const insertNode = useCallback((nodes: FileNode[], newNode: FileNode): FileNode[] => {
    const parts = newNode.path.split('/').filter(Boolean);
    
    if (parts.length === 1) {
      const existingIndex = nodes.findIndex(node => node.path === newNode.path);
      if (existingIndex >= 0) {
        nodes[existingIndex] = newNode;
        return [...nodes];
      }
      return [...nodes, newNode];
    }

    const parentPath = parts.slice(0, -1).join('/');
    const parentNode = nodes.find(node => node.path === parentPath);

    if (parentNode) {
      parentNode.children = insertNode(parentNode.children, newNode);
      return [...nodes];
    }

    const newParent = createFileStructure(parentPath, true);
    newParent.children = [newNode];
    return insertNode(nodes, newParent);
  }, [createFileStructure]);

  // Process file operations
  const processFileOperations = useCallback((operations: FileOperation[]) => {
    const newContents = { ...fileContents };
    let newStructure = [...fileStructure];

    operations.forEach(({ path, content, type, isDirectory = false }) => {
      switch (type) {
        case 'create':
        case 'update':
          if (!isDirectory && content !== undefined) {
            newContents[path] = content;
          }
          newStructure = insertNode(newStructure, createFileStructure(path, isDirectory));
          break;

        case 'delete':
          if (!isDirectory) {
            delete newContents[path];
          }
          newStructure = newStructure.filter(node => !node.path.startsWith(path));
          break;
      }
    });

    setFileContents(newContents);
    setFileStructure(newStructure);

    // Update selected file if current selection is no longer valid
    if (selectedFile && !newContents[selectedFile]) {
      const firstAvailableFile = Object.keys(newContents)[0] || null;
      setSelectedFile(firstAvailableFile);
    }
  }, [fileContents, fileStructure, selectedFile, createFileStructure, insertNode]);

  // Update file system from generated code
  const updateFileSystem = useCallback((generatedCode: string) => {
    try {
      // Parse the generated code to extract file operations
      const operations: FileOperation[] = [];
      
      // Example format: "CREATE filename.ext\n```content```" or "DELETE filename.ext"
      const codeLines = generatedCode.split('\n');
      let currentOperation: Partial<FileOperation> | null = null;
      let content = [];

      for (const line of codeLines) {
        if (line.startsWith('CREATE ') || line.startsWith('UPDATE ')) {
          if (currentOperation) {
            operations.push({
              ...currentOperation,
              content: content.join('\n'),
            } as FileOperation);
          }
          currentOperation = {
            path: line.split(' ')[1],
            type: line.startsWith('CREATE ') ? 'create' : 'update',
            isDirectory: false
          };
          content = [];
        } else if (line.startsWith('DELETE ')) {
          if (currentOperation) {
            operations.push({
              ...currentOperation,
              content: content.join('\n'),
            } as FileOperation);
          }
          operations.push({
            path: line.split(' ')[1],
            type: 'delete',
          });
          currentOperation = null;
          content = [];
        } else if (currentOperation) {
          content.push(line);
        }
      }

      if (currentOperation) {
        operations.push({
          ...currentOperation,
          content: content.join('\n'),
        } as FileOperation);
      }

      processFileOperations(operations);
    } catch (error) {
      console.error('Error updating file system:', error);
      throw new Error('Failed to update file system');
    }
  }, [processFileOperations]);

  // Reset file system
  const resetFileSystem = useCallback(() => {
    setFileStructure([]);
    setFileContents({});
    setSelectedFile(null);
  }, []);

  return {
    fileStructure,
    fileContents,
    selectedFile,
    setSelectedFile,
    updateFileSystem,
    resetFileSystem,
  };
}