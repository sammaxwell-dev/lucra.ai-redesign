import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CHATS);
  // Key state to force re-render/reset of chat
  const [sessionKey, setSessionKey] = useState(0);

  const handleNewChat = () => {
    setSessionKey(prev => prev + 1);
    setCurrentView(ViewState.CHATS);
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onNewChat={handleNewChat}
      />
      <MainChat key={sessionKey} onNewChat={handleNewChat} />
    </div>
  );
};

export default App;