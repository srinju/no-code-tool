import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { FolderTree, Code2, Terminal, ChevronRight, File, FileJson, FileText } from 'lucide-react';

interface FileStructure {
  [key: string]: string;
}

const BuilderPage = () => {
  const location = useLocation();
  const { prompt } = location.state || { prompt: '' };
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [files, setFiles] = useState<FileStructure>({
    'index.html': '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Website</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>',
    'styles.css': 'body {\n  margin: 0;\n  padding: 20px;\n}',
    'script.js': 'console.log("Hello World!");'
  });

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.html')) return <FileText className="w-4 h-4" />;
    if (filename.endsWith('.css')) return <File className="w-4 h-4" />;
    if (filename.endsWith('.js')) return <FileJson className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100">
      <div className="h-12 bg-gray-900/80 border-b border-gray-800 flex items-center px-4">
        <Terminal className="w-5 h-5 text-blue-400 mr-2" />
        <span className="font-semibold">WebCraft AI Builder</span>
      </div>
      
      <div className="flex h-[calc(100vh-48px)]">
        {/* Left Sidebar - Execution Log */}
        <div className="w-1/4 bg-gray-900/50 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center text-sm text-gray-400">
              <Terminal className="w-4 h-4 mr-2" />
              <span>Execution Log</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono space-y-3">
            <p className="text-green-400 text-sm">→ Received prompt: {prompt}</p>
            <p className="text-blue-400 text-sm">→ Analyzing requirements...</p>
            <p className="text-purple-400 text-sm">→ Generating website structure...</p>
            <p className="text-yellow-400 text-sm">→ Creating files...</p>
            <p className="text-orange-400 text-sm">→ Optimizing code...</p>
            <p className="text-pink-400 text-sm">→ Implementing responsive design...</p>
            <p className="text-teal-400 text-sm">→ Adding animations...</p>
            <p className="text-indigo-400 text-sm">→ Finalizing layout...</p>
          </div>
        </div>

        {/* Middle Left - File Explorer */}
        <div className="w-1/4 bg-gray-900/50 border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center text-sm text-gray-400">
              <FolderTree className="w-4 h-4 mr-2" />
              <span>Project Files</span>
            </div>
          </div>
          <div className="p-2">
            {Object.keys(files).map((filename) => (
              <div
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer text-sm ${
                  selectedFile === filename 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'hover:bg-gray-800/50 text-gray-300'
                }`}
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                {getFileIcon(filename)}
                <span className="ml-2">{filename}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Code Editor */}
        <div className="w-1/2">
          {selectedFile ? (
            <Editor
              height="100%"
              defaultLanguage={selectedFile.endsWith('.js') ? 'javascript' : selectedFile.endsWith('.css') ? 'css' : 'html'}
              theme="vs-dark"
              value={files[selectedFile]}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: true,
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <Code2 className="w-6 h-6 mr-2" />
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;