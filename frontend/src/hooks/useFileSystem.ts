import { useState } from 'react'
import { FileNode } from '../types/FileSystem'

export function useFileSystem() {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([])
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const updateFileSystem = (newStructure: FileNode[], newContents: Record<string, string>) => {
    setFileStructure(newStructure)
    setFileContents(newContents)
    setSelectedFile(Object.keys(newContents)[0] || null)
  }

  return {
    fileStructure,
    fileContents,
    selectedFile,
    setSelectedFile,
    updateFileSystem,
  }
}

