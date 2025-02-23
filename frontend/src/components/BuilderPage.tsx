import React, { useEffect } from 'react';
import { ChevronDown, ChevronRight, File, Folder, Code, Play, Terminal } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import Editor from '@monaco-editor/react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export default function BuilderPage() {
    const { 
      steps, 
      files, 
      selectedFile, 
      toggleFolder, 
      setSelectedFile,
      activeTab,
      setActiveTab 
    } = useBuilderStore();

    const location = useLocation()
    const renderFile = (file: any) => {
    const Icon = file.type === 'folder' ? Folder : File;
    const Chevron = file.type === 'folder' && (file.isOpen ? ChevronDown : ChevronRight);
    const {prompt} = location.state as {prompt : string};
  
    
    

    //the user gives the prompt we hit navigate to this page
    //then it sends a request to the template witht the user prompt and we get back prompts and ui prompts
    //ui prompts are for the steps
    //prompts are for the code generation
    //then we send req to /chat with user prompt and prompts from prev respinse and get the generated code directly in the web container

    
    async function initFetch() {

      try {
        //hit template endpoint with the user prompt
        const response = await axios.post(`${BACKEND_URL}/template` , {
          messages : prompt
        });
        //get back prompts and ui prompys>
        const {prompts , uiPrompts} = response.data;
        //we send a request with the prompts to the /chat endpoint >
        const secondResponse = await axios.post(`${BACKEND_URL}/chat` , {
          messages : [...prompts , {prompt}].map(content => ({
            role : "user",
            content : content
          }))
        });

      } catch (error) {
          console.error("an error occured while sedning request to the backend!!");
      }
    }


    useEffect(() => {
      initFetch();
    },[]);

    return (
      <div key={file.id}>
        <div
          className={`flex items-center p-2 hover:bg-gray-700 cursor-pointer ${
            selectedFile?.id === file.id ? 'bg-gray-700' : ''
          }`}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              setSelectedFile(file);
            }
          }}
        >
          {file.type === 'folder' && <Chevron className="h-4 w-4 text-gray-400 mr-1" />}
          <Icon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-200">{file.name}</span>
        </div>
        {file.type === 'folder' && file.isOpen && (
          <div className="ml-4">
            {file.children?.map((child: any) => renderFile(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Steps Sidebar */}
      <div className="w-1/4 border-r border-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Build Steps</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg ${
                step.status === 'completed'
                  ? 'bg-green-900/20 border-green-600'
                  : step.status === 'current'
                  ? 'bg-purple-900/20 border-purple-600'
                  : 'bg-gray-800 border-gray-700'
              } border`}
            >
              <h3 className="text-white font-medium">{step.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* File Explorer */}
      <div className="w-[15%] border-r border-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Files</h2>
        <div className="overflow-y-auto">{files.map(renderFile)}</div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs and Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-800">
            <button
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'text-purple-500 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('code')}
            >
              <Code size={16} />
              Code
            </button>
            <button
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'text-purple-500 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              <Play size={16} />
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'code' ? (
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={selectedFile?.content || '// Select a file to view its content'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            ) : (
              <div className="h-full bg-white rounded-lg m-4">
                <iframe
                  src="about:blank"
                  className="w-full h-full rounded-lg"
                  title="Preview"
                />
              </div>
            )}
          </div>
        </div>

        {/* Shell/Terminal */}
        <div className="h-1/4 border-t border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Terminal size={16} />
            <span>Terminal</span>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 h-[calc(100%-2rem)] overflow-y-auto font-mono text-sm">
            <div className="text-green-500">$ npm install</div>
            <div className="text-gray-400">Installing dependencies...</div>
            <div className="text-green-500">$ npm run dev</div>
            <div className="text-gray-400">Starting development server...</div>
            <div className="text-white">Ready on http://localhost:3000</div>
          </div>
        </div>
      </div>
    </div>
  );
}