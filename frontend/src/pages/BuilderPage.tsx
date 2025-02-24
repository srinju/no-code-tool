import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileCode, Folder, ChevronDown, ChevronRight, Terminal, Eye } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { FileItem, Step } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';

export default function BuilderPage() {
  const location = useLocation();
  const prompt = location.state?.prompt || '';

  const [steps,setSteps] = useState<Step[]>([]);

  const [fileStructure] = useState<FileItem[]>([
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            {
              name: 'Header.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-6">
        <h1>Your Website</h1>
      </nav>
    </header>
  );
}`
            },
            {
              name: 'Footer.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <p>&copy; 2024 Your Website</p>
      </div>
    </footer>
  );
}`
            }
          ]
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            {
              name: 'Home.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1>Welcome to Your Website</h1>
      </main>
      <Footer />
    </div>
  );
}`
            }
          ]
        },
        {
          name: 'styles',
          type: 'folder',
          children: [
            {
              name: 'globals.css',
              type: 'file',
              language: 'css',
              content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50;
}`
            }
          ]
        },
        {
          name: 'App.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';
import Home from './pages/Home';

export default function App() {
  return <Home />;
}`
        }
      ]
    }
  ]);


  useEffect(() => {
    const init = async() => {

        try {

          //send the prompt of the user to the backend at /template get the prompts and the ui prompts
          //then send the prompts to the /chat and the prompt of the user to gete the code back

          const response = await axios.post(`${BACKEND_URL}/template`,{
            prompt : prompt.trim()
          });

          console.log("response from the /template endpoint!!", response.data);

          //get the prompts >
          const {prompts , uiPrompts} = response.data;

          setSteps(parseXml(uiPrompts[0]));

          //send another request to /chat with the prompts and the userPrompt

          const anotherResponse = await axios.post(`${BACKEND_URL}/chat` , {
            messages : [...prompts , prompt].map(content => ({
                role : "user",
                content : content
            }))
          });

          console.log("response from the chaat endpoint : " , anotherResponse);

        } catch (error) {

          console.error("there was an error sending the request to the backend! " , error);

        }
    }
    init();
  },[]);

  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  console.log("steps -----------------------------------------------------------", steps);

  const renderFileTree = (items: FileItem[], path = '') => {
    return items.map((item) => {
      const currentPath = path ? `${path}/${item.name}` : item.name;
      const isExpanded = expandedFolders.has(currentPath);

      if (item.type === 'folder') {
        return (
          <div key={currentPath}>
            <button
              onClick={() => toggleFolder(currentPath)}
              className="flex items-center gap-2 w-full hover:bg-gray-700 px-2 py-1 rounded text-left"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="text-blue-400" />
              <span>{item.name}</span>
            </button>
            {isExpanded && item.children && (
              <div className="pl-4">
                {renderFileTree(item.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <button
          key={currentPath}
          onClick={() => setSelectedFile(item)}
          className={`flex items-center gap-2 w-full hover:bg-gray-700 px-2 py-1 rounded text-left ${
            selectedFile === item ? 'bg-gray-700' : ''
          }`}
        >
          <FileCode size={16} className="text-gray-400" />
          <span>{item.name}</span>
        </button>
      );
    });
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Left Sidebar - Steps */}
      <div className="w-80 bg-gray-800 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Building your website</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`
                flex items-center gap-4
                ${step.status === 'completed' ? 'text-green-500' : 
                  step.status === 'current' ? 'text-blue-500' : 'text-gray-500'}
              `}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${step.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    step.status === 'current' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-gray-700 text-gray-500'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-px h-8 bg-gray-700"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-12 bg-gray-800 flex items-center px-4 gap-4">
          <button
            onClick={() => setPreviewMode('code')}
            className={`px-3 py-1 rounded ${previewMode === 'code' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <FileCode size={20} />
          </button>
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1 rounded ${previewMode === 'preview' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <Eye size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            {renderFileTree(fileStructure)}
          </div>

          {/* Code Preview */}
          <div className="flex-1 bg-gray-900">
            {previewMode === 'code' ? (
              selectedFile ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language={selectedFile.language}
                  value={selectedFile.content}
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
                <div className="h-full flex items-center justify-center text-gray-400">
                  Select a file to view its contents
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Preview loading...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}