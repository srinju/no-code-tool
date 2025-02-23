import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const setStorePrompt = useBuilderStore((state) => state.setPrompt);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStorePrompt(prompt);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Wand2 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Website Builder AI</h1>
          <p className="text-gray-400">Describe your dream website and let AI build it for you</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website (e.g., 'Create a modern portfolio website with a dark theme...')"
            className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Generate Website
          </button>
        </form>
      </div>
    </div>
  );
}