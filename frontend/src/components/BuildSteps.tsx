import React from 'react';
import { CheckCircle2, Circle, Timer } from 'lucide-react';

type Step = {
  name: string;
  status: 'pending' | 'inProgress' | 'completed';
};

export function BuildSteps() {
  const steps: Step[] = [
    { name: 'Initialize Project', status: 'completed' },
    { name: 'Create Components', status: 'inProgress' },
    { name: 'Style Implementation', status: 'pending' },
    { name: 'Final Touches', status: 'pending' },
  ];

  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={18} className="text-green-500" />;
      case 'inProgress':
        return <Timer size={18} className="text-blue-500 animate-pulse" />;
      case 'pending':
        return <Circle size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="w-1/4 bg-gray-800 border-r border-gray-700 p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Build Steps</h2>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              step.status === 'inProgress' ? 'bg-gray-700' : 'bg-gray-750'
            }`}
          >
            {getStepIcon(step.status)}
            <span className={step.status === 'completed' ? 'line-through text-gray-400' : ''}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}