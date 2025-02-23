import React from 'react';
import { Code2 } from 'lucide-react';
import Editor from "@monaco-editor/react";

type PreviewTab = 'code' | 'live';

interface PreviewPanelProps {
  selectedFile: string | null;
}

export function PreviewPanel({ selectedFile }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = React.useState<PreviewTab>('code');

  return (
    <div className="w-1/2 bg-gray-900">
      <div className="h-full flex flex-col">
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Code2 size={20} />
              <span className="font-semibold">
                {selectedFile ? selectedFile : 'Select a file to view'}
              </span>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors">
              Refresh Preview
            </button>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === 'code'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === 'live'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-800">
          {selectedFile ? (
            activeTab === 'code' ? (
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={`// ${selectedFile}\n// Code will appear here`}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            ) : (
              <iframe
                className="w-full h-full bg-white"
                title="Live Preview"
                src="/preview"
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">Select a file to view its {activeTab === 'code' ? 'code' : 'preview'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}