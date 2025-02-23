import React from 'react';
import { Play } from 'lucide-react';

interface LandingPageProps {
  onSubmit: (prompt: string) => void;
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
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
  );
}