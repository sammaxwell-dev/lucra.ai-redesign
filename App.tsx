import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import { ViewState } from './types';

import FilesView from './components/FilesView';

interface FileData {
  id: string;
  name: string;
  size: string;
  date: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CHATS);
  // Key state to force re-render/reset of chat
  const [sessionKey, setSessionKey] = useState(0);
  // Sidebar collapsed state (desktop) and mobile menu open state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // File state lifted up
  const [files, setFiles] = useState<FileData[]>([
    { id: '1', name: 'Årsredovisning 2023.pdf', size: '2.4 MB', date: 'Oct 24, 2023' },
    { id: '2', name: 'Skatteverket Beslut.pdf', size: '1.1 MB', date: 'Nov 12, 2023' },
    { id: '3', name: 'Lönerapport Q4.xlsx', size: '856 KB', date: 'Jan 15, 2024' },
  ]);

  const handleNewChat = () => {
    setSessionKey(prev => prev + 1);
    setCurrentView(ViewState.CHATS);
  };

  const handleSetFiles = (newFiles: FileData[]) => {
    setFiles(newFiles);
  };

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  return (
    <div className="flex w-full h-screen max-w-[2560px] mx-auto bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        onNewChat={handleNewChat}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />
      {currentView === ViewState.FILES ? (
        <FilesView files={files} onUpload={handleSetFiles} onDelete={() => { }} />
      ) : (
        <MainChat key={sessionKey} onNewChat={handleNewChat} />
      )}
    </div>
  );
};

export default App;