import React from 'react';
import { FileText, Folder, ChevronDown } from 'lucide-react';

type FileStructure = {
  name: string;
  type: 'file' | 'folder';
  children?: FileStructure[];
};

interface FileExplorerProps {
  selectedFile: string | null;
  onFileSelect: (file: string) => void;
}

export function FileExplorer({ selectedFile, onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

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
          onClick={() => onFileSelect(currentPath)}
        >
          <FileText size={16} className="text-gray-400" />
          <span className="text-sm">{item.name}</span>
        </div>
      );
    });
  };

  return (
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
  );
}