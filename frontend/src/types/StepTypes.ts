export enum StepType {
    CreateFile = 'CreateFile',
    CreateFolder = 'CreateFolder',
    RunScript = 'RunScript',
    Error = 'Error'
  }
  
  export enum StepStatus {
    Pending = 'pending',
    InProgress = 'in-progress',
    Completed = 'completed',
    Failed = 'failed'
  }
  
  export interface Step {
    id: number;
    title: string;
    description: string;
    type: StepType;
    status: StepStatus;
    path?: string;
    code?: string;
    error?: string;
  }