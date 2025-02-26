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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-850 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in">
            Build Your Website with AI
          </h1>
          <p className="text-xl text-gray-300 mb-12 animate-slide-up">
            Transform your ideas into a stunning website in minutes with our cutting-edge AI technology
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website..."
                className="w-full px-6 py-4 rounded-xl bg-gray-900/80 border-2 border-gray-800/50 focus:border-gradient-to-r focus:from-blue-500 focus:to-purple-500 focus:outline-none text-lg transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/30"
              >
                Build <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              { icon: Wand2, title: 'AI-Powered', desc: 'Our intelligent AI crafts the perfect website from your vision' },
              { icon: Code2, title: 'Clean Code', desc: 'Generate sleek, modern code built for performance' },
              { icon: Rocket, title: 'Instant Deploy', desc: 'Launch your site to the world in a single click' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/80 p-6 rounded-xl backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add some custom CSS in your stylesheet */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}