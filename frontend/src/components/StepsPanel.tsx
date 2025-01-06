import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, Loader2, AlertCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: StepStatus;
  path?: string;
  code?: string;
  error?: string;
}

enum StepType {
  CreateFile = 'CreateFile',
  CreateFolder = 'CreateFolder',
  RunScript = 'RunScript',
  Error = 'Error'
}

enum StepStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
  Failed = 'failed'
}

const StepsPanel = ({ 
  apiSteps = [], 
  updateFileSystem 
}: { 
  apiSteps: any[];
  updateFileSystem: (operations: string) => void;
}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (apiSteps.length) {
      const formattedSteps = apiSteps.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description || '',
        type: step.type as StepType,
        status: step.status as StepStatus,
        path: step.path || '',
        code: step.code || ''
      }));
      setSteps(formattedSteps);
    }
  }, [apiSteps]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      
      // Process the current step
      if (step.status === StepStatus.Pending) {
        // Update step status to in-progress
        const updatedSteps = [...steps];
        updatedSteps[currentStep] = { ...step, status: StepStatus.InProgress };
        setSteps(updatedSteps);

        // Create file or folder based on step type
        if (step.type === StepType.CreateFile && step.path) {
          updateFileSystem(`CREATE ${step.path}\n${step.code || ''}`);
        } else if (step.type === StepType.CreateFolder && step.path) {
          updateFileSystem(`CREATE ${step.path}\n`);
        }

        // Mark step as completed and move to next step
        setTimeout(() => {
          const completedSteps = [...updatedSteps];
          completedSteps[currentStep] = { ...step, status: StepStatus.Completed };
          setSteps(completedSteps);
          setCurrentStep(prev => prev + 1);
        }, 500);
      }
    }
  }, [steps, currentStep, updateFileSystem]);

  const getStepIcon = (status: StepStatus, index: number) => {
    if (status === StepStatus.Failed) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (status === StepStatus.InProgress) return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    if (status === StepStatus.Completed) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-4">Generation Steps</h2>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-2 rounded hover:bg-zinc-800 ${
              step.status === StepStatus.Failed ? 'text-red-400' : ''
            }`}
          >
            {getStepIcon(step.status, index)}
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-sm">{step.title}</span>
              {step.path && <span className="text-xs text-gray-500">{step.path}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsPanel;