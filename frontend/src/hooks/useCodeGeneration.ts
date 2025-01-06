// import { useState } from 'react';
// import { FileNode } from '../types/FileSystem';

// export function useCodeGeneration(
//   updateFileSystem: (structure: FileNode[], contents: Record<string, string>) => void
// ) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [steps, setSteps] = useState<string[]>([]);

//   const generateCode = async (prompt: string, parsedSteps: string[]) => {
//     if (!prompt.trim()) {
//       console.error('Prompt is empty or invalid.');
//       return;
//     }

//     try {
//       // Dynamically update steps
//       setSteps(parsedSteps);

//       for (let i = 0; i < parsedSteps.length; i++) {
//         setCurrentStep(i);
//         await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate step delay
//       }

//       // Generate the file structure and contents
//       const newFileStructure: FileNode[] = [
//         {
//           name: 'src',
//           type: 'folder',
//           path: 'src',
//           children: [
//             {
//               name: 'app',
//               type: 'folder',
//               path: 'src/app',
//               children: [
//                 { name: 'page.tsx', type: 'file', path: 'src/app/page.tsx' },
//               ],
//             },
//             {
//               name: 'components',
//               type: 'folder',
//               path: 'src/components',
//               children: [
//                 { name: 'header.tsx', type: 'file', path: 'src/components/header.tsx' },
//               ],
//             },
//             {
//               name: 'lib',
//               type: 'folder',
//               path: 'src/lib',
//               children: [
//                 { name: 'utils.ts', type: 'file', path: 'src/lib/utils.ts' },
//               ],
//             },
//             {
//               name: 'styles',
//               type: 'folder',
//               path: 'src/styles',
//               children: [
//                 { name: 'globals.css', type: 'file', path: 'src/styles/globals.css' },
//               ],
//             },
//           ],
//         },
//       ];

//       const newFileContents: Record<string, string> = {
//         'src/app/page.tsx': `// Content generated based on prompt: ${prompt}\nexport default function Home() {\n  return <div>Hello World</div>\n}`,
//         'src/components/header.tsx': '// Content of header.tsx\nexport function Header() {\n  return <header>My App</header>\n}',
//         'src/lib/utils.ts': '// Content of utils.ts\nexport function formatDate(date: Date) {\n  return date.toLocaleDateString();\n}',
//         'src/styles/globals.css': '/* Content of globals.css */\nbody {\n  font-family: sans-serif;\n}',
//       };

//       updateFileSystem(newFileStructure, newFileContents);
//     } catch (error) {
//       console.error('Error during code generation:', error);
//     }
//   };

//   return {
//     generateCode,
//     currentStep,
//     steps,
//   };
// }


import { useState } from 'react';
import { FileNode } from '../types/FileSystem';
import { Step, StepType } from '../types/StepTypes';

export function useCodeGeneration(
  updateFileSystem: (structure: FileNode[], contents: Record<string, string>) => void
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const createFileInStructure = (
    structure: FileNode[],
    path: string,
    content: string
  ): FileNode[] => {
    const pathParts = path.split('/').filter(Boolean);
    const fileName = pathParts[pathParts.length - 1];
    let currentLevel = structure;
    let currentPath = '';

    // Create folders in path if they don't exist
    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += '/' + pathParts[i];
      let folder = currentLevel.find(
        (item) => item.type === 'folder' && item.name === pathParts[i]
      );

      if (!folder) {
        folder = {
          name: pathParts[i],
          type: 'folder',
          path: currentPath,
          children: [],
        };
        currentLevel.push(folder);
      }
      currentLevel = folder.children!;
    }

    // Add or update file
    const filePath = currentPath + '/' + fileName;
    const existingFileIndex = currentLevel.findIndex(
      (item) => item.type === 'file' && item.name === fileName
    );

    const newFile: FileNode = {
      name: fileName,
      type: 'file',
      path: filePath,
      content: content,
    };

    if (existingFileIndex >= 0) {
      currentLevel[existingFileIndex] = newFile;
    } else {
      currentLevel.push(newFile);
    }

    return [...structure];
  };

  const generateCode = async (steps: Step[]) => {
    let currentStructure = [...fileStructure];
    let currentContents = { ...fileContents };

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(i);

      if (step.type === StepType.CreateFile && step.status === 'pending') {
        // Update file structure
        currentStructure = createFileInStructure(
          currentStructure,
          step.path!,
          step.code || ''
        );

        // Update file contents
        currentContents[step.path!] = step.code || '';

        // Update the file system
        updateFileSystem(currentStructure, currentContents);
        
        // Store the updated state
        setFileStructure(currentStructure);
        setFileContents(currentContents);

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  const processNextStep = async (steps: Step[]) => {
    const pendingStepIndex = steps.findIndex((step) => step.status === 'pending');
    if (pendingStepIndex >= 0) {
      setCurrentStep(pendingStepIndex);
      await generateCode([steps[pendingStepIndex]]);
    }
  };

  return {
    generateCode,
    processNextStep,
    currentStep,
    fileStructure,
    fileContents,
  };
}
