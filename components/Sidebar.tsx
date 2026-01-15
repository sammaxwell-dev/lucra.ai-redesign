import React from 'react';
import {
  MessageSquare,
  FolderOpen,
  Search,
  LogOut,
  LayoutGrid,
  SquarePen,
  PanelLeft,
  Settings,
  Users
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
      {/* Header */}
      <div className="pt-6 px-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Icon and Text */}
          <img src={icon} alt="Lucra Icon" className="w-8 h-8" />
          <span className="text-2xl font-bold text-[#3D506D] tracking-tight">Lucra</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onNewChat} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <SquarePen size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <PanelLeft size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-slate-50 text-slate-700 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all placeholder:text-slate-400 border border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-slate-400 mb-2 pl-3">Menu</h3>
          <nav className="space-y-0.5">
            <button
              onClick={() => setView(ViewState.HOME)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentView === ViewState.HOME ? 'bg-[#e4ecf5] text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              <LayoutGrid size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setView(ViewState.CHATS)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentView === ViewState.CHATS ? 'bg-[#e4ecf5] text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              <MessageSquare size={18} />
              Chats
            </button>
            <button
              onClick={() => setView(ViewState.FILES)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentView === ViewState.FILES ? 'bg-[#e4ecf5] text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              <FolderOpen size={18} />
              Files
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
          </nav>
        </div>

        {/* History Section */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-slate-400 mb-2 pl-3">History</h3>
          <div className="space-y-0.5">
            <div className="px-3 py-1.5 flex items-center gap-3 text-slate-400 text-xs font-medium uppercase tracking-wider">
              Today
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-colors">
              <MessageSquare size={16} className="shrink-0 text-slate-400" />
              <span className="truncate">Inkomstdeklaration 1</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-colors">
              <MessageSquare size={16} className="shrink-0 text-slate-400" />
              <span className="truncate">Rot & Rut Deduction</span>
            </button>
            <div className="px-3 py-1.5 mt-2 flex items-center gap-3 text-slate-400 text-xs font-medium uppercase tracking-wider">
              7 Days Ago
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-colors">
              <MessageSquare size={16} className="shrink-0 text-slate-400" />
              <span className="truncate">Moms (VAT) Rules 2024</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-colors">
              <MessageSquare size={16} className="shrink-0 text-slate-400" />
              <span className="truncate">Aktiebolag vs Enskild</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:text-slate-900 text-sm hover:bg-slate-50 transition-colors">
              <MessageSquare size={16} className="shrink-0 text-slate-400" />
              <span className="truncate">K10 Form Calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            SM
          </div>
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Shamil Musaev</p>
            <p className="text-xs text-slate-500 truncate">shamil.musaev@lucra.ai</p>
          </div>
          <LogOut size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;