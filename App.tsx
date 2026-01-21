import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import { ViewState } from './types';
import { PanelLeft } from 'lucide-react';

import FilesView from './components/FilesView';
import SettingsView from './components/SettingsView';

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
  // Sidebar state
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
    <div className="flex w-full h-screen max-w-[2560px] mx-auto bg-slate-50 overflow-hidden font-sans relative">
      <div className="flex w-full h-full transition-all duration-500 ease-in-out">
        <div className={`transition-all duration-500 ease-in-out h-full overflow-hidden flex-shrink-0 flex items-center ${isSidebarCollapsed ? 'w-24' : 'w-80'}`}>
          <Sidebar
            currentView={currentView}
            setView={setCurrentView}
            onNewChat={handleNewChat}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            isMobileOpen={isMobileMenuOpen}
            onMobileToggle={toggleMobileMenu}
          />
        </div>

        <div className="flex-1 h-full overflow-hidden flex items-center">
          {currentView === ViewState.FILES ? (
            <FilesView files={files} onUpload={handleSetFiles} onDelete={() => { }} />
          ) : currentView === ViewState.SETTINGS ? (
            <SettingsView />
          ) : (
            <MainChat key={sessionKey} onNewChat={handleNewChat} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;