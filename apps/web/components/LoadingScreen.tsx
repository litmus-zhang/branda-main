import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Logo } from '@branda/ui/components/logo';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <Logo className="h-16 relative z-10 animate-bounce" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white/90">{message}</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Branda AI Neural Link</span>
          </div>
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
  );
};
