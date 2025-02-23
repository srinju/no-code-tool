import { create } from 'zustand';
import { Step, File } from '../types';

interface BuilderStore {
  prompt: string;
  setPrompt: (prompt: string) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  toggleFolder: (fileId: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  activeTab: 'code' | 'preview';
  setActiveTab: (tab: 'code' | 'preview') => void;
}

const initialSteps: Step[] = [
  {
    id: '1',
    title: 'Project Setup',
    status: 'completed',
    description: 'Initialize project with React and Tailwind CSS'
  },
  {
    id: '2',
    title: 'Component Creation',
    status: 'current',
    description: 'Creating basic components and layout structure'
  },
  {
    id: '3',
    title: 'Styling Implementation',
    status: 'pending',
    description: 'Implementing responsive design and dark theme'
  },
  {
    id: '4',
    title: 'State Management',
    status: 'pending',
    description: 'Setting up global state with Zustand'
  }
];

const initialFiles: File[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'header',
            name: 'Header.tsx',
            type: 'file',
            content: 'import React from "react";\n\nexport default function Header() {\n  return (\n    <header className="bg-gray-800 p-4">\n      <h1 className="text-white">My App</h1>\n    </header>\n  );\n}'
          },
          {
            id: 'footer',
            name: 'Footer.tsx',
            type: 'file',
            content: 'import React from "react";\n\nexport default function Footer() {\n  return (\n    <footer className="bg-gray-800 p-4 mt-auto">\n      <p className="text-gray-400">© 2024 My App</p>\n    </footer>\n  );\n}'
          }
        ]
      },
      {
        id: 'styles',
        name: 'styles',
        type: 'folder',
        isOpen: false,
        children: [
          {
            id: 'main',
            name: 'main.css',
            type: 'file',
            content: '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n.custom-class {\n  @apply bg-blue-500 text-white p-4;\n}'
          }
        ]
      },
      {
        id: 'app',
        name: 'App.tsx',
        type: 'file',
        content: 'import React from "react";\nimport Header from "./components/Header";\nimport Footer from "./components/Footer";\n\nexport default function App() {\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-1 p-4">\n        <h1>Welcome to My App</h1>\n      </main>\n      <Footer />\n    </div>\n  );\n}'
      }
    ]
  },
  {
    id: 'public',
    name: 'public',
    type: 'folder',
    isOpen: false,
    children: [
      {
        id: 'index',
        name: 'index.html',
        type: 'file',
        content: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>My App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>'
      }
    ]
  }
];

export const useBuilderStore = create<BuilderStore>((set) => ({
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  steps: initialSteps,
  setSteps: (steps) => set({ steps }),
  files: initialFiles,
  setFiles: (files) => set({ files }),
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  activeTab: 'code',
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleFolder: (fileId) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId ? { ...file, isOpen: !file.isOpen } : file
      ),
    })),
}));