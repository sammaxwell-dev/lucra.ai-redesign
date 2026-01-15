import React from 'react';
import {
  MessageSquare,
  FolderOpen,
  Search,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { ViewState } from '../types';

import icon from '../assets/icon.svg';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onNewChat }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 h-[95vh] my-auto ml-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden shrink-0">
      {/* Header / Logo */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-8 cursor-pointer px-2" onClick={onNewChat}>
          {/* Logo Icon and Text */}
          <img src={icon} alt="Lucra Icon" className="w-10 h-10" />
          <span className="text-3xl font-bold text-[#3D506D] tracking-tight">Lucra</span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all placeholder:text-slate-400 border border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] text-slate-400 border border-slate-200 rounded px-1">⌘</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <button
            onClick={() => setView(ViewState.HOME)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentView === ViewState.HOME ? 'bg-[#e4ecf5] text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <LayoutGrid size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setView(ViewState.CHATS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentView === ViewState.CHATS ? 'bg-[#e4ecf5] text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <MessageSquare size={18} />
            Chats
          </button>
          <button
            onClick={() => setView(ViewState.FILES)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentView === ViewState.FILES ? 'bg-[#e4ecf5] text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <FolderOpen size={18} />
            Files
          </button>
        </nav>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-2">Today</h3>
          <div className="space-y-1">
            <button className="w-full text-left truncate text-slate-600 hover:text-slate-900 text-sm py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
              Inkomstdeklaration 1
            </button>
            <button className="w-full text-left truncate text-slate-600 hover:text-slate-900 text-sm py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
              Rot & Rut Deduction
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-2">7 Days Ago</h3>
          <div className="space-y-1">
            <button className="w-full text-left truncate text-slate-600 hover:text-slate-900 text-sm py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
              Moms (VAT) Rules 2024
            </button>
            <button className="w-full text-left truncate text-slate-600 hover:text-slate-900 text-sm py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
              Aktiebolag vs Enskild
            </button>
            <button className="w-full text-left truncate text-slate-600 hover:text-slate-900 text-sm py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
              K10 Form Calculation
            </button>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
            SM
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">Shamil Musaev</p>
            <p className="text-xs text-slate-500 truncate">shamil.musaev@lucra.ai</p>
          </div>
          <LogOut size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;