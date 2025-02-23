
export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}

export interface Step {
  id: number;
  title: string;
  type : StepType;
  status: 'completed' | 'pending' | 'current';
  description: string;
  code? : string;
  path?: string
}

export interface File {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: File[];
  isOpen?: boolean;
}