import { useState } from 'react'
import { FileNode } from '../types/FileSystem'

const steps = [
  'Analyze prompt',
  'Generate project structure',
  'Create component files',
  'Implement core functionality',
  'Add styling'
]

export function useCodeGeneration(updateFileSystem: (structure: FileNode[], contents: Record<string, string>) => void) {
  const [currentStep, setCurrentStep] = useState(0)

  const generateCode = (prompt: string) => {
    // Mock implementation - in a real app, this would call an AI service
    const newFileStructure: FileNode[] = [
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'app',
            type: 'folder',
            children: [
              { name: 'page.tsx', type: 'file' }
            ]
          },
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'header.tsx', type: 'file' }
            ]
          },
          {
            name: 'lib',
            type: 'folder',
            children: [
              { name: 'utils.ts', type: 'file' }
            ]
          },
          {
            name: 'styles',
            type: 'folder',
            children: [
              { name: 'globals.css', type: 'file' }
            ]
          }
        ]
      }
    ]
    
    const newFileContents: Record<string, string> = {
      'src/app/page.tsx': `// Content generated based on prompt: ${prompt}\nexport default function Home() {\n  return <div>Hello World</div>\n}`,
      'src/components/header.tsx': '// Content of header.tsx\nexport function Header() {\n  return <header>My App</header>\n}',
      'src/lib/utils.ts': '// Content of utils.ts\nexport function formatDate(date: Date) {\n  return date.toLocaleDateString()\n}',
      'src/styles/globals.css': '/* Content of globals.css */\nbody {\n  font-family: sans-serif;\n}'
    }

    updateFileSystem(newFileStructure, newFileContents)
    setCurrentStep(steps.length - 1) // Set to last step after generation
  }

  return {
    generateCode,
    currentStep,
    steps,
  }
}

