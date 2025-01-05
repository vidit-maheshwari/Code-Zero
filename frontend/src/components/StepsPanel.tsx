// import { Check, Circle } from 'lucide-react'

// interface StepsPanelProps {
//   currentStep: number
// }

// const steps = [
//   'Analyze prompt',
//   'Generate project structure',
//   'Create component files',
//   'Implement core functionality',
//   'Add styling'
// ]

// export function StepsPanel({ currentStep }: StepsPanelProps) {
//   return (
//     <div>
//       <h3 className="font-medium mb-4">Generation Steps</h3>
//       <div className="space-y-3">
//         {steps.map((step, index) => (
//           <div
//             key={step}
//             className={`flex items-center gap-3 w-full p-2 rounded ${
//               currentStep === index ? 'bg-zinc-800' : ''
//             }`}
//           >
//             {index <= currentStep ? (
//               <Check className="w-4 h-4 text-green-500" />
//             ) : (
//               <Circle className="w-4 h-4" />
//             )}
//             <span className={index <= currentStep ? 'text-white' : 'text-zinc-400'}>
//               {step}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

import React from 'react';

interface Step {
  id: number;
  title: string;
  description?: string;
  type: number;
  status: string;
}

interface StepsPanelProps {
  steps: Step[];
  currentStep: number;
}

export const StepsPanel: React.FC<StepsPanelProps> = ({ steps, currentStep }) => {
  return (
    <div className="steps-panel flex flex-col space-y-2 overflow-y-auto max-h-full">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`p-3 border rounded ${
            currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-300'
          }`}
        >
          <h4 className="font-semibold text-sm">{step.title}</h4>
          {step.description && (
            <p className="text-xs mt-1 text-gray-400">{step.description}</p>
          )}
          <p className="text-xs mt-1">
            Status: <span className="font-medium">{step.status}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

