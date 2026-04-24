import React from 'react';
import { Workspace } from '../lib/types';
import { Sparkles, Plus, LogOut, ChevronRight, X } from 'lucide-react';
import { Logo } from '@branda/ui/components/logo';
import { UserButton } from '@branda/ui/components/user/user-button';

import { ThemeToggle } from './ThemeToggle';

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
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-sidebar-border shrink-0 relative transition-colors duration-500">
      <div className="p-8 flex items-center justify-between">
        <Logo className="scale-110 origin-left" />
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground active:scale-95 transition-all">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="px-5 py-2 flex-1 overflow-y-auto no-scrollbar">
        <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">Operational Units</h3>
        <div className="space-y-1.5">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => handleSwitch(ws.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${currentWorkspaceId === ws.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-primary/20'
                : 'hover:bg-sidebar-accent/30 text-muted-foreground hover:text-foreground'
                }`}
            >
              <div className="flex items-center truncate">
                <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${currentWorkspaceId === ws.id ? 'bg-primary scale-125 shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground'}`} />
                <span className={`truncate max-w-[140px] text-sm tracking-tight ${currentWorkspaceId === ws.id ? 'font-black' : 'font-bold'}`}>{ws.name}</span>
              </div>
              {currentWorkspaceId === ws.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          ))}

          <button
            onClick={handleCreate}
            className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300 mt-4 border border-dashed ${currentWorkspaceId === 'new'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground border-primary/50 shadow-md ring-1 ring-primary/20'
              : 'text-muted-foreground border-sidebar-border hover:bg-sidebar-accent/50 hover:text-primary hover:border-primary/30'
              }`}
          >
            <Plus className={`w-4 h-4 mr-3 transition-transform ${currentWorkspaceId === 'new' ? 'rotate-90' : 'group-hover:rotate-90'}`} />
            <span className="font-black uppercase tracking-widest text-[10px]">Initialize New</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border mt-auto bg-muted/5 backdrop-blur-sm space-y-4">
        <ThemeToggle />
        <div className="px-2">
          <UserButton />
        </div>
      </div>
    </aside>
  );
};