import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileCode, Folder, ChevronDown, ChevronRight, Terminal, Eye } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { FileItem, Step, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';

export default function BuilderPage() {
  const location = useLocation();
  const prompt = location.state?.prompt || '';

  const [steps,setSteps] = useState<Step[]>([]);

  const[files , setFiles] = useState<FileItem[]>([]);

  const [fileStructure] = useState<FileItem[]>([]);

  const webContainer = useWebContainer(); //boots the webcontainer and save the instance of the webContainer
    
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
          //console.log("ui prompts :-------------------" , uiPrompts);

          //console.log('PARSED UI PROMPTS : -----------------------' , parseXml(uiPrompts));

          setSteps(parseXml(uiPrompts).map((x : Step) => ({
            ...x,
            status : "pending" as "pending"
          })));

          //send another request to /chat with the prompts and the userPrompt

          const anotherResponse = await axios.post(`${BACKEND_URL}/chat` , {
            messages : [...prompts , prompt].map(content => ({
                role : "user",
                content : content
            }))
          });

          console.log("response from the chaat endpoint : " , anotherResponse);

          //update the steps when the code with the new shit comes it will update the build files 
          setSteps(s => [...s , ...parseXml(anotherResponse.data.response).map(x => ({
            ...x,
            status : "pending" as "pending"
          }))]);

        } catch (error) {

          console.error("there was an error sending the request to the backend! " , error);

        }
    }
    init();
  },[]);

  //from /template we get the uiPrompts from there we parse the steps 
  //now we want to make the initial files 

  //trigger the useffect when the file comes and the steps are there

  //the steps state looks like this >

  /*
  
  code : "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>"
  description :  ""
  id : 3 
  path : "index.html"
  status : "pending"
  title : "Create index.html"

  */


  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext'; // Fallback for unknown file types
    }
  };

  useEffect(() => {
    
    let originalFiles = [...files]; //clone files without affecting the original files
    let updateHappened = false; //setting a false flag for updates made
    //looping through each pending steps and make them updatehappened true and do the needful
    steps.filter(({ status }) => status === 'pending').forEach(step => {
      updateHappened = true;
      //check if the step is a file creation step and the file has a path
      if (step.type === StepType.CreateFile && step.path) {
        let parsedPath = step.path.split("/"); //parsing file path
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = "";
        //loop until all path segments are completed
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`; //build the currnet folder and path one at a time
          let currentFolderName = parsedPath[0]; //save the current folder name
          parsedPath = parsedPath.slice(1); //remove the processed segment from the path array
  
          if (!parsedPath.length) {
            //this means we are at the last segnemtnt (actual files)
            let file = currentFileStructure.find(x => x.path === currentFolder);
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code || '',
                language : getLanguageFromPath(currentFolderName)
              });
            } else {
              file.content = step.code || '';
            }
          } else {
            //folder creation logic >
            let folder = currentFileStructure.find(x => x.path === currentFolder);
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              });
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)?.children || [];
          }
        }
        originalFiles = finalAnswerRef;
      }
    });
  
    if (updateHappened) {
      setFiles(originalFiles);
      setSteps(steps => steps.map((s: Step) => ({
        ...s,
        status: "completed"
      })));
    }

    console.log("files --------------------------------- " , files);
  }, [steps, files]);

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
    // Sort items: folders first, then files, both alphabetically
    const sortedItems = [...items].sort((a, b) => {
      // If types are different, folders come first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      // If types are the same, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  
    return sortedItems.map((item) => {
      // Rest of your rendering code remains the same
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
            {renderFileTree(files)}
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