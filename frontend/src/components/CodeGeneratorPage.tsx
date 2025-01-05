

// import { useState, useEffect } from 'react'
// import { Resizable } from 're-resizable'
// import { FileExplorer } from '@/components/FileExplorer'
// import { StepsPanel } from '@/components/StepsPanel'
// import { PromptInput } from '@/components/PromptInput'
// import { CodeEditor } from '@/components/CodeEditor'
// import { useFileSystem } from '@/hooks/useFileSystem'
// import { useCodeGeneration } from '@/hooks/useCodeGeneration'
// import { backend_url } from '../config'
// import axios from 'axios'

// interface CodeGeneratorPageProps {
//   initialPrompt: string
// }

// export function CodeGeneratorPage({ initialPrompt }: CodeGeneratorPageProps) {
//   const [prompt, setPrompt] = useState(initialPrompt)
//   const { fileStructure, fileContents, selectedFile, setSelectedFile, updateFileSystem } = useFileSystem()
//   const { generateCode, currentStep } = useCodeGeneration(updateFileSystem)

//   const init = async (initialPrompt:string) => {
//     const response = await axios.post(`${backend_url}/template`, {
//       body: JSON.stringify({ prompt: initialPrompt.trim() })
//     });
//     const {prompts, uiPrompts} = response.data;

//     const stepResponse = await axios.post(`${backend_url}/chat`, {
//       messages:[...prompts, initialPrompt].map(content =>({
//         role: "user",
//         content: content
//       }))
//     });

//   }

//   useEffect(() => {
//     init(initialPrompt);
//     generateCode(prompt)
//   }, [])

//   const handleRegenerateCode = () => {
//     generateCode(prompt)
//   }

//   return (
//     <div className="flex h-screen bg-zinc-900 text-white">
//       <Resizable
//         defaultSize={{ width: 250, height: '100%' }}
//         enable={{ right: true }}
//         minWidth={200}
//         maxWidth={400}
//       >
//         <div className="h-full border-r border-zinc-800 p-4 flex flex-col">
//           {/* <StepsPanel currentStep={currentStep} /> */}
//           <PromptInput
//             prompt={prompt}
//             setPrompt={setPrompt}
//             onSubmit={handleRegenerateCode}
//           />
//         </div>
//       </Resizable>
      
//       <div className="flex-1 flex">
//         <Resizable
//           defaultSize={{ width: '30%', height: '100%' }}
//           enable={{ right: true }}
//           minWidth={200}
//           maxWidth="50%"
//         >
//           <div className="h-full border-r border-zinc-800 p-4 overflow-auto">
//             <FileExplorer 
//               files={fileStructure} 
//               onSelectFile={setSelectedFile}
//               selectedFile={selectedFile}
//             />
//           </div>
//         </Resizable>

//         <CodeEditor
//           selectedFile={selectedFile}
//           fileContents={fileContents}
//         />
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from 'react';
// import { Resizable } from 're-resizable';
// import { FileExplorer } from '@/components/FileExplorer';
// import { PromptInput } from '@/components/PromptInput';
// import { CodeEditor } from '@/components/CodeEditor';
// import { useFileSystem } from '@/hooks/useFileSystem';
// import { useCodeGeneration } from '@/hooks/useCodeGeneration';
// import { backend_url } from '../config';
// import axios from 'axios';
// import { parseXml } from '../components/steps';
// import { StepsPanel } from './StepsPanel';



// interface CodeGeneratorPageProps {
//   initialPrompt: string;
// }

// export function CodeGeneratorPage({ initialPrompt }: CodeGeneratorPageProps) {
//   const [prompt, setPrompt] = useState(initialPrompt);
//   const { fileStructure, fileContents, selectedFile, setSelectedFile, updateFileSystem } = useFileSystem();
//   const { generateCode, currentStep } = useCodeGeneration(updateFileSystem);

//   const init = async (initialPrompt: string) => {
//     console.log(initialPrompt);
//     try {
//       const response = await axios.post(`${backend_url}/template`, {
//         prompt: initialPrompt.trim(),
//       });

//       const { prompts, uiPrompts } = response.data;

//       const stepResponse = await axios.post(`${backend_url}/chat`, {
//         messages: [...prompts, initialPrompt].map((content) => ({
//           role: 'user',
//           content: content,
//         })),
//       });
//       const parsedXml = await parseXml(uiPrompts[0]);
//       console.log(parsedXml);

//     } catch (error: any) {
//       console.error('Error initializing:', error.message || error);
//     }
//   };

//   useEffect(() => {
//     init(initialPrompt);
//     generateCode(prompt);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleRegenerateCode = () => {
//     generateCode(prompt);
//   };

//   return (
//     <div className="flex h-screen bg-zinc-900 text-white">
//       {/* Left Sidebar for Prompt Input */}
//       <Resizable
//         defaultSize={{ width: 250, height: '100%' }}
//         enable={{ right: true }}
//         minWidth={200}
//         maxWidth={400}
//       >
//         <div className="h-full border-r border-zinc-800 p-4 flex flex-col">
//           {parseXml(uiPrompts[0]).map((item, index) => (
//               <StepsPanel key={index} currentStep={currentStep} />
//           ))}
//           <PromptInput
//             prompt={prompt}
//             setPrompt={setPrompt}
//             onSubmit={handleRegenerateCode}
//           />
//         </div>
//       </Resizable>

//       {/* Main Content Area */}
//       <div className="flex-1 flex">
//         {/* File Explorer */}
//         <Resizable
//           defaultSize={{ width: '30%', height: '100%' }}
//           enable={{ right: true }}
//           minWidth={200}
//           maxWidth="50%"
//         >
//           <div className="h-full border-r border-zinc-800 p-4 overflow-auto">
//             <FileExplorer
//               files={fileStructure}
//               onSelectFile={setSelectedFile}
//               selectedFile={selectedFile}
//             />
//           </div>
//         </Resizable>

//         {/* Code Editor */}
//         <CodeEditor selectedFile={selectedFile} fileContents={fileContents} />
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { FileExplorer } from '@/components/FileExplorer';
import { PromptInput } from '@/components/PromptInput';
import { CodeEditor } from '@/components/CodeEditor';
import { StepsPanel } from '@/components/StepsPanel';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useCodeGeneration } from '@/hooks/useCodeGeneration';
import { backend_url } from '../config';
import axios from 'axios';
import { parseXml } from '../components/steps';

interface CodeGeneratorPageProps {
  initialPrompt: string;
}

export function CodeGeneratorPage({ initialPrompt }: CodeGeneratorPageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [steps, setSteps] = useState([]); // State to store parsed steps
  const { fileStructure, fileContents, selectedFile, setSelectedFile, updateFileSystem } = useFileSystem();
  const { generateCode, currentStep } = useCodeGeneration(updateFileSystem);

  const init = async (initialPrompt: string) => {
    try {
      const response = await axios.post(`${backend_url}/template`, {
        prompt: initialPrompt.trim(),
      });

      const { prompts, uiPrompts } = response.data;
      const parsedSteps = parseXml(uiPrompts[0]); // Parse the steps from the response
      setSteps(parsedSteps); // Store the steps in state
    } catch (error: any) {
      console.error('Error initializing:', error.message || error);
    }
  };

  useEffect(() => {
    init(initialPrompt);
    generateCode(prompt);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerateCode = () => {
    generateCode(prompt);
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Left Sidebar for Prompt Input and Steps */}
      <Resizable
  defaultSize={{ width: 250, height: '100%' }}
  enable={{ right: true }}
  minWidth={200}
  maxWidth={400}
>
  <div className="h-full border-r border-zinc-800 p-4 flex flex-col">
    {/* Steps Panel */}
    <div className="flex-grow overflow-y-auto">
      <StepsPanel steps={steps} currentStep={currentStep} />
    </div>
    {/* Prompt Input */}
    <PromptInput
      prompt={prompt}
      setPrompt={setPrompt}
      onSubmit={handleRegenerateCode}
    />
  </div>
</Resizable>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* File Explorer */}
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

        {/* Code Editor */}
        <CodeEditor selectedFile={selectedFile} fileContents={fileContents} />
      </div>
    </div>
  );
}
