// FileExplorer.tsx
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import {  FileExplorerItemProps, FileExplorerProps } from '@/types/FileSystem';



const FileExplorerItem: React.FC<FileExplorerItemProps> = ({ 
  node, 
  path, 
  onSelectFile, 
  selectedFile 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullPath = `${path}/${node.name}`;

  const handleClick = () => {
    if (node.type === 'file') {
      onSelectFile(fullPath.slice(1));
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-zinc-800 rounded ${
          selectedFile === fullPath.slice(1) ? 'bg-zinc-800 text-white' : 'text-zinc-400'
        }`}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === 'folder' ? (
          <Folder size={16} className="mr-2 text-blue-400" />
        ) : (
          <File size={16} className="mr-2 text-gray-400" />
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div className="ml-4">
          {node.children.map((child) => (
            <FileExplorerItem
              key={child.name}
              node={child}
              path={fullPath}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FileExplorer({ files, onSelectFile, selectedFile }: FileExplorerProps) {
  return (
    <div className="text-sm">
      <h3 className="font-medium mb-2 text-gray-300">Explorer</h3>
      <div className="space-y-1">
        {files.map((file) => (
          <FileExplorerItem
            key={file.name}
            node={file}
            path=""
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
}

// types/FileSystem.ts
