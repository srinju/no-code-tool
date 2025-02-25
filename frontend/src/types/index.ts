
export enum StepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunScript 
}

export interface Step {
    id : number,
    type : StepType,
    code? : string,
    path? : string
    title: string;
    status: 'completed' | 'current' | 'pending';
    description: string;
} 

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  language?: string;
  path : string
}