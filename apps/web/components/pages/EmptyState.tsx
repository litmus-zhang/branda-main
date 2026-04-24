import React from 'react';
import { Sparkles, Plus, Rocket } from 'lucide-react';
import { Button } from "@branda/ui/components/button";
import { Card, CardContent } from "@branda/ui/components/card";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-24 h-24 bg-white shadow-2xl rounded-3xl flex items-center justify-center border border-slate-100 rotate-6 hover:rotate-0 transition-transform duration-500">
          <Rocket className="w-12 h-12 text-primary-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-100 shadow-lg rounded-xl flex items-center justify-center border border-amber-200 -rotate-12">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold mb-4 tracking-tight">
        Welcome to your <span className="text-primary-600">Growth Engine.</span>
      </h1>

      <p className="text-slate-600 max-w-md mb-10 leading-relaxed">
        You haven't created any workspaces yet. Let's launch your first business idea and build something amazing together.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mb-12">
        <Card className="bg-white/50 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-1">Brand Identity</h3>
            <p className="text-xs text-slate-500">Logos, colors, and tone.</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-1">Marketing</h3>
            <p className="text-xs text-slate-500">Strategy and channels.</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-1">Operations</h3>
            <p className="text-xs text-slate-500">Systems and SOPs.</p>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={onCreateClick}
        size="lg"
        className="px-8 py-7 text-lg font-bold shadow-xl shadow-primary-500/20 rounded-2xl group transition-all"
      >
        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
        Create Your First Workspace
      </Button>

      <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm">
        <Sparkles className="w-4 h-4" />
        AI-powered generation takes only 30 seconds
      </div>
    </div>
  );
};
