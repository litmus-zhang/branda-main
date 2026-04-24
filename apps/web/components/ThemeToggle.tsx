"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@branda/ui/lib/utils';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-2 p-1 bg-muted/20 rounded-xl border border-border/40 animate-pulse">
        <div className="h-3 w-12 bg-muted rounded mx-3 mt-1" />
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex flex-col gap-2 p-1 bg-muted/30 rounded-xl border border-border/50">
       <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1 px-3 mt-1">Appearance</h3>
       <div className="grid grid-cols-3 gap-1">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-lg transition-all duration-500 relative group",
                isActive 
                  ? "bg-background text-primary shadow-lg ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-pressed={isActive}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-primary/5 animate-in fade-in duration-500" />
              )}
              <Icon className={cn(
                "w-4 h-4 transition-transform duration-500 z-10", 
                isActive ? "text-primary scale-110" : "group-hover:scale-110"
              )} />
              <span className="text-[8px] font-black uppercase tracking-tight z-10">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
