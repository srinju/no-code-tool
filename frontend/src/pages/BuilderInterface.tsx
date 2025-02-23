import React from 'react';
import { BuildSteps } from '../components/BuildSteps';
import { FileExplorer } from '../components/FileExplorer';
import { PreviewPanel } from '../components/PreviewPanel';

export function BuilderInterface() {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <BuildSteps />
      <FileExplorer
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />
      <PreviewPanel selectedFile={selectedFile} />
    </div>
  );
}