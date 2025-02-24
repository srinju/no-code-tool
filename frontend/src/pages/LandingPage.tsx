import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Code2, Rocket, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Build Your Website with AI
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Transform your ideas into a fully functional website in minutes using our AI-powered website builder
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website..."
                className="w-full px-6 py-4 rounded-lg bg-gray-800 border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                Build <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Wand2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
              <p className="text-gray-400">
                Just describe what you want, and our AI will generate the perfect website for you
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clean Code</h3>
              <p className="text-gray-400">
                Generate production-ready code that follows best practices and modern standards
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Deploy</h3>
              <p className="text-gray-400">
                Deploy your website instantly with just one click to your preferred platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}