import React from 'react';
import {
  MessageSquare,
  MessageSquareText,
  FolderOpen,
  Search,
  LogOut,
  LayoutGrid,
  SquarePen,
  PanelLeft,
  Settings,
  MoreHorizontal,
  Menu,
  X
} from 'lucide-react';
import { ViewState } from '../types';

import icon from '../assets/icon.svg';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  onNewChat,
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileToggle
}) => {
  const [showHistory, setShowHistory] = React.useState(true);
  // Shared sidebar content component
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Header */}
      <div className={`pt-6 ${isCollapsed && !mobile ? 'px-2' : 'px-6'} pb-2 flex items-center ${isCollapsed && !mobile ? 'flex-col gap-4' : 'justify-between'}`}>
        <div className={`flex items-center gap-2 ${isCollapsed && !mobile ? 'justify-center w-full' : ''}`}>
          {/* Logo Icon and Text */}
          <img src={icon} alt="Lucra Icon" className="w-8 h-8" />
          {(!isCollapsed || mobile) && (
            <span className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                Lucra
              </span>
            </span>
          )}
        </div>

        <div className={`flex items-center gap-2 ${isCollapsed && !mobile ? 'flex-col' : ''}`}>
          {(!isCollapsed || mobile) && (
            <button onClick={onNewChat} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <SquarePen size={20} />
            </button>
          )}
          {mobile ? (
            <button onClick={onMobileToggle} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <X size={20} />
            </button>
          ) : (
            <button onClick={onToggle} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
              <PanelLeft size={20} className={isCollapsed ? 'rotate-180' : ''} />
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isCollapsed && !mobile ? 'px-2' : 'px-4'} custom-scrollbar mt-4`}>
        {/* Simplified Navigation */}
        <nav className="space-y-1 mb-8">
          <button
            onClick={() => { setView(ViewState.HOME); mobile && onMobileToggle(); }}
            className={`w-full flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === ViewState.HOME ? 'bg-[#e4ecf5] text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            title="Dashboard"
          >
            <LayoutGrid size={18} />
            {(!isCollapsed || mobile) && 'Dashboard'}
          </button>
          <button
            onClick={() => { setView(ViewState.CHATS); mobile && onMobileToggle(); }}
            className={`w-full flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === ViewState.CHATS ? 'bg-[#e4ecf5] text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            title="Chats"
          >
            <MessageSquare size={18} />
            {(!isCollapsed || mobile) && 'Chats'}
          </button>
          <button
            onClick={() => { setView(ViewState.FILES); mobile && onMobileToggle(); }}
            className={`w-full flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === ViewState.FILES ? 'bg-[#e4ecf5] text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            title="Files"
          >
            <FolderOpen size={18} />
            {(!isCollapsed || mobile) && 'Files'}
          </button>
          <button
            onClick={() => { setView(ViewState.SETTINGS); mobile && onMobileToggle(); }}
            className={`w-full flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === ViewState.SETTINGS ? 'bg-[#e4ecf5] text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            title="Settings"
          >
            <Settings size={18} />
            {(!isCollapsed || mobile) && 'Settings'}
          </button>
        </nav>

        {/* History Section with Toggle */}
        {(!isCollapsed || mobile) && (
          <div className="mb-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 mb-3 pl-3 pr-2 uppercase tracking-widest hover:text-slate-600 transition-colors group"
            >
              <span>History</span>
              <div className={`transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}>
                <PanelLeft size={14} className="rotate-90" />
              </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${showHistory ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden space-y-0.5">
                <div className="px-3 py-1.5 flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Today
                </div>
                <button className="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-all">
                  <MessageSquareText size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">Inkomstdeklaration 1</span>
                  <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                </button>
                <button className="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-all">
                  <MessageSquareText size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">Rot & Rut Deduction</span>
                  <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'gap-3'} p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group`}>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            SM
          </div>
          {(!isCollapsed || mobile) && (
            <>
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-sm font-semibold truncate">
                  <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                    Shamil Musaev
                  </span>
                </p>
                <p className="text-xs text-slate-500 truncate">shamil.musaev@lucra.ai</p>
              </div>
              <LogOut size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={onMobileToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobileOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onMobileToggle}
        />
        {/* Mobile sidebar */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <SidebarContent mobile={true} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-[95vh] my-auto ml-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden shrink-0 transition-all duration-300 ease-out ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        <SidebarContent mobile={false} />
      </aside>
    </>
  );
};

export default Sidebar;