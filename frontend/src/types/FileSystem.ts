// export interface FileNode {
//   name: string;
//   type: 'file' | 'folder';
//   children?: FileNode[];
//   content?: string;
//   path: string;
// }
  

// // types/FileSystem.ts
// export type FileType = 'file' | 'folder';

// export interface FileNode {
//   name: string;
//   type: FileType;
//   path: string;
//   content?: string;
//   children?: FileNode[];
//   metadata?: {
//     createdAt: Date;
//     updatedAt: Date;
//     size?: number;
//     extension?: string;
//   };
// }

// export interface FileSystemState {
//   structure: FileNode[];
//   contents: Record<string, string>;
//   selectedFile: string | null;
// }


export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    size?: number;
    extension?: string;
  };
}


export interface FileExplorerProps {
  files: FileNode[];
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}

export interface FileExplorerItemProps {
  node: FileNode;
  path: string;
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}