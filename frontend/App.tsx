import React, { useState } from 'react';
import MultiAgentChat from './components/MultiAgentChat';
import GuidedMode from './components/GuidedMode';

const App: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'questionnaire'>('chat');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">StyleSense AI</h1>
          <div className="flex gap-2 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setMode('chat')}
              className={`px-4 py-2 rounded-lg transition ${
                mode === 'chat' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
              }`}
            >
              💬 Chat Mode
            </button>
            <button
              onClick={() => setMode('questionnaire')}
              className={`px-4 py-2 rounded-lg transition ${
                mode === 'questionnaire' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
              }`}
            >
              📋 Guided Mode
            </button>
          </div>
        </div>
      </div>
      
      {mode === 'chat' ? <MultiAgentChat /> : <GuidedMode />}
    </div>
  );
};

export default App;
