import React, { useState } from 'react';
import { FileText, Play, Code2, ChevronRight, Folder, CheckCircle2, Circle, Timer, ChevronDown } from 'lucide-react';
import Editor from "@monaco-editor/react";

type Step = {
  name: string;
  status: 'pending' | 'inProgress' | 'completed';
};

type FileStructure = {
  name: string;
  type: 'file' | 'folder';
  children?: FileStructure[];
};

type PreviewTab = 'code' | 'live';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<PreviewTab>('code');

  const steps: Step[] = [
    { name: 'Initialize Project', status: 'completed' },
    { name: 'Create Components', status: 'inProgress' },
    { name: 'Style Implementation', status: 'pending' },
    { name: 'Final Touches', status: 'pending' },
  ];

  const fileStructure: FileStructure[] = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.tsx', type: 'file' },
            { name: 'Footer.tsx', type: 'file' },
          ]
        },
        {
          name: 'styles',
          type: 'folder',
          children: [
            { name: 'main.css', type: 'file' },
            { name: 'components.css', type: 'file' },
          ]
        },
        { name: 'App.tsx', type: 'file' },
        { name: 'main.tsx', type: 'file' },
      ]
    },
    { name: 'index.html', type: 'file' },
    { name: 'package.json', type: 'file' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuilding(true);
  };

  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={18} className="text-green-500" />;
      case 'inProgress':
        return <Timer size={18} className="text-blue-500 animate-pulse" />;
      case 'pending':
        return <Circle size={18} className="text-gray-500" />;
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileTree = (items: FileStructure[], path = '') => {
    return items.map((item) => {
      const currentPath = path ? `${path}/${item.name}` : item.name;
      
      if (item.type === 'folder') {
        const isExpanded = expandedFolders.has(currentPath);
        return (
          <div key={currentPath}>
            <div
              className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => toggleFolder(currentPath)}
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${isExpanded ? 'transform rotate-0' : 'transform -rotate-90'}`}
              />
              <Folder size={16} className="text-blue-400" />
              <span className="text-sm">{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="ml-4 border-l border-gray-700">
                {renderFileTree(item.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={currentPath}
          className={`flex items-center space-x-2 p-2 hover:bg-gray-800 rounded cursor-pointer ${
            selectedFile === currentPath ? 'bg-gray-800' : ''
          }`}
          onClick={() => setSelectedFile(currentPath)}
        >
          <FileText size={16} className="text-gray-400" />
          <span className="text-sm">{item.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {!isBuilding ? (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Website Builder AI
            </h1>
            <p className="text-gray-400 text-lg">
              Describe your website and watch the magic happen
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-100"
                placeholder="Describe your website (e.g., 'Create a modern landing page for a tech startup with a hero section, features grid, and contact form')"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Play size={20} />
              <span>Generate Website</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Steps Panel (25%) */}
          <div className="w-1/4 bg-gray-800 border-r border-gray-700 p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Build Steps</h2>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    step.status === 'inProgress' ? 'bg-gray-700' : 'bg-gray-750'
                  }`}
                >
                  {getStepIcon(step.status)}
                  <span className={step.status === 'completed' ? 'line-through text-gray-400' : ''}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* File Explorer (25%) */}
          <div className="w-1/4 bg-gray-900 border-r border-gray-700">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Folder size={20} />
                <span>Files</span>
              </h2>
              <div className="space-y-1">
                {renderFileTree(fileStructure)}
              </div>
            </div>
          </div>

          {/* Preview Panel (50%) */}
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
        </div>
      )}
    </div>
  );
}

export default App;