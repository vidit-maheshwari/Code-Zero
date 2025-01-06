import { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { FileExplorer } from '@/components/FileExplorer';
import { PromptInput } from '@/components/PromptInput';
import { CodeEditor } from '@/components/CodeEditor';
import StepsPanel from '@/components/StepsPanel';
import { FileNode } from '@/types/FileSystem';
import axios from 'axios';
import { parseXml } from '../components/steps';
import { backend_url } from '../config';

interface CodeGeneratorPageProps {
  initialPrompt: string;
}

export function CodeGeneratorPage({ initialPrompt }: CodeGeneratorPageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [steps, setSteps] = useState([]);
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const createFileStructure = (path: string, content: string = '') => {
    const parts = path.split('/').filter(Boolean);
    let currentPath = '';

    const updateStructure = (structure: FileNode[], depth: number = 0): FileNode[] => {
      if (depth === parts.length) return structure;

      const part = parts[depth];
      currentPath = depth === 0 ? part : `${currentPath}/${part}`;
      const isFile = depth === parts.length - 1;

      const existingNodeIndex = structure.findIndex(node => node.name === part);
      
      if (existingNodeIndex === -1) {
        if (isFile) {
          structure.push({
            name: part,
            type: 'file',
            path: currentPath
          });
          setFileContents(prev => ({
            ...prev,
            [currentPath]: content
          }));
        } else {
          structure.push({
            name: part,
            type: 'folder',
            path: currentPath,
            children: []
          });
        }
      }

      if (!isFile) {
        const targetNode = existingNodeIndex === -1 
          ? structure[structure.length - 1] 
          : structure[existingNodeIndex];
        if (targetNode.type === 'folder') {
          targetNode.children = updateStructure(targetNode.children || [], depth + 1);
        }
      }

      return structure;
    };

    setFileStructure(prevStructure => {
      const newStructure = [...prevStructure];
      return updateStructure(newStructure);
    });
  };

  const updateFileSystem = (operation: string) => {
    const [action, path, ...contentParts] = operation.split('\n');
    const content = contentParts.join('\n');
    
    if (action === 'CREATE') {
      createFileStructure(path, content);
    }
  };

  const init = async (initialPrompt: string) => {
    try {
      const response = await axios.post(`${backend_url}/template`, {
        prompt: initialPrompt.trim(),
      });

      const { prompts, uiPrompts } = response.data;
      const parsedSteps = parseXml(uiPrompts[0]);
      setSteps(parsedSteps);
      
      parsedSteps.forEach(step => {
        if ((step.type === 'CreateFile' || step.type === 'CreateFolder') && step.path) {
          createFileStructure(step.path, step.code || '');
        }
      });
    } catch (error: any) {
      console.error('Error initializing:', error.message || error);
    }
  };

  useEffect(() => {
    init(initialPrompt);
  }, [initialPrompt]);

  const handleRegenerateCode = () => {
    setFileStructure([]);
    setFileContents({});
    setSelectedFile(null);
    init(prompt);
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      <Resizable
        defaultSize={{ width: 250, height: '100%' }}
        enable={{ right: true }}
        minWidth={200}
        maxWidth={400}
      >
        <div className="h-full border-r border-zinc-800 p-4 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <StepsPanel 
              apiSteps={steps}
              updateFileSystem={updateFileSystem}
            />
          </div>
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleRegenerateCode}
          />
        </div>
      </Resizable>

      <div className="flex-1 flex">
        <Resizable
          defaultSize={{ width: '30%', height: '100%' }}
          enable={{ right: true }}
          minWidth={200}
          maxWidth="50%"
        >
          <div className="h-full border-r border-zinc-800 p-4 overflow-auto">
            <FileExplorer
              files={fileStructure}
              onSelectFile={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>
        </Resizable>

        <CodeEditor 
          selectedFile={selectedFile} 
          fileContents={fileContents}
        />
      </div>
    </div>
  );
}