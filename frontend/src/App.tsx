import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { BuilderInterface } from './pages/BuilderInterface';

function App() {
  const [isBuilding, setIsBuilding] = useState(false);

  const handlePromptSubmit = (prompt: string) => {
    setIsBuilding(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {!isBuilding ? (
        <LandingPage onSubmit={handlePromptSubmit} />
      ) : (
        <BuilderInterface />
      )}
    </div>
  );
}

export default App;