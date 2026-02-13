import React from 'react';
import { Workspace } from '../types';
import { Sparkles, Plus, LogOut, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  onSwitchWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
  onLogout: () => void;
  userName: string;
  onClose?: () => void; // Optional for mobile closing
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  workspaces, 
  currentWorkspaceId, 
  onSwitchWorkspace, 
  onCreateWorkspace,
  onLogout,
  userName,
  onClose
}) => {
  const handleSwitch = (id: string) => {
    onSwitchWorkspace(id);
    if (onClose) onClose();
  };

  const handleCreate = () => {
    onCreateWorkspace();
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0 relative">
      <div className="p-6 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-wide">Branda</span>
        </div>
        {onClose && (
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
            </button>
        )}
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Workspaces</h3>
        <div className="space-y-1">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => handleSwitch(ws.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                currentWorkspaceId === ws.id 
                  ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center truncate">
                <div className={`w-2 h-2 rounded-full mr-3 ${currentWorkspaceId === ws.id ? 'bg-primary-400' : 'bg-slate-600'}`} />
                <span className="truncate max-w-[140px]">{ws.name}</span>
              </div>
              {currentWorkspaceId === ws.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          
          <button
            onClick={handleCreate}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors mt-2 ${
                currentWorkspaceId === 'new'
                ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 mr-3" />
            Create Workspace
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3 shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-2 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};