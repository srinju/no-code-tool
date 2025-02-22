import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Code2, Zap, Package } from 'lucide-react';

const LandingPage = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Wand2 className="w-12 h-12 mr-4 text-blue-400" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              WebCraft AI
            </h1>
          </div>
          <p className="text-xl mb-12 text-gray-300">
            Transform your ideas into production-ready websites with the power of AI.
            Just describe what you want, and watch the magic happen.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website..."
                className="w-full px-6 py-4 text-lg rounded-xl bg-gray-800/50 backdrop-blur-xl border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Create Website
              </button>
            </div>
          </form>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
              <Zap className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Get your website generated in seconds with our advanced AI technology</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200">
              <Code2 className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customizable</h3>
              <p className="text-gray-400">Edit and customize every aspect of your generated website</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 hover:border-pink-500/30 transition-all duration-200">
              <Package className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Production Ready</h3>
              <p className="text-gray-400">Get clean, optimized code ready for deployment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;