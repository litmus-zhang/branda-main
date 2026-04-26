import React, { useState, useEffect } from 'react';
import { Workspace, ViewType, BusinessPlan } from '@/lib/types';
import { Sidebar } from '../Sidebar';
import { BrandView } from '../views/BrandView';
import { MarketingView } from '../views/MarketingView';
import { SystemsView } from '../views/SystemsView';
import { CRMView } from '../views/CRMView';
import { IntegrationsView } from '../views/IntegrationsView';
import { TeamView } from '../views/TeamView';
import { BrainstormingView } from '../views/BrainstormingView';
import { FundingView } from '../views/FundingView';
import { PlusCircle, Loader2, Menu, Lock, Briefcase, Globe, PenTool, Sparkles } from 'lucide-react';
import { Button } from "@branda/ui/components/button";
import { Input } from "@branda/ui/components/input";
import { Textarea } from "@branda/ui/components/textarea";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@branda/ui/components/card";
import { Badge } from "@branda/ui/components/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessGenerateSchema, type BusinessGenerateValues } from "@/lib/schemas";
import { cn } from "@branda/ui/lib/utils";
import { EmptyState } from './EmptyState';
import { Label } from '@branda/ui/components/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useIsMutating } from '@tanstack/react-query';
import InboxComponent from '../Notification';

interface DashboardProps {
  user: { id: string; name: string; email: string };
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  onSwitchWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
  onUpdateWorkspace: (workspace: Workspace) => void;
  onLogout: () => void;
  onGenerateNew: (data: any) => void;
  isGenerating: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  workspaces,
  currentWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onUpdateWorkspace,
  onLogout,
  onGenerateNew,
  isGenerating
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const isMutating = useIsMutating();
  const [activeView, setActiveView] = useState<ViewType>((searchParams.get('view') as ViewType) || 'brand');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync activeView with URL search params
  useEffect(() => {
    const view = searchParams.get('view') as ViewType;
    if (view && view !== activeView) {
      setActiveView(view);
    }
  }, [searchParams, activeView]);

  const handleSetView = (view: ViewType) => {
    setActiveView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  // Determine user role and permissions
  const currentUserRole = currentWorkspace?.collaborators.find(c => c.email === user.email)?.role || 'owner';

  // Permissions
  const isReadOnly = currentUserRole === 'viewer';
  // Integrations can be managed by Owner and Admin
  const canManageIntegrations = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Feature Gating Logic
  const tier = currentWorkspace?.tier || 'Free';
  const isFreeTier = tier === 'Free';
  const isLocked = false; // isFreeTier && activeView !== 'brand';

  const handleUpdatePlan = (newPlan: BusinessPlan) => {
    if (currentWorkspace) {
      onUpdateWorkspace({
        ...currentWorkspace,
        plan: newPlan,
        name: newPlan.brandIdentity.name // Keep workspace name in sync with brand name
      });
    }
  };

  const handleUpgrade = () => {
    if (currentWorkspace) {
      onUpdateWorkspace({
        ...currentWorkspace,
        tier: 'Starter'
      });
      alert("Mock Upgrade Successful! You are now on the Starter plan.");
    }
  };

  // New Workspace Creation Form
  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors }
  } = useForm<BusinessGenerateValues>({
    resolver: zodResolver(businessGenerateSchema),
    defaultValues: {
      niche: '',
      businessName: '',
      details: '',
      country: ''
    }
  });

  const onSubmit = (data: BusinessGenerateValues) => {
    onGenerateNew(data);
    reset();
  };

  if (currentWorkspaceId === 'new') {
    return (
      <div className="flex h-screen bg-background transition-colors duration-500">
        <div className="hidden md:flex h-full">
          <Sidebar
            workspaces={workspaces}
            currentWorkspaceId={currentWorkspaceId}
            onSwitchWorkspace={onSwitchWorkspace}
            onCreateWorkspace={onCreateWorkspace}
            onLogout={onLogout}
            userName={user.name}
          />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-muted/20">
          <Card className="max-w-2xl w-full mx-4 shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] border-border overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="pt-10 px-10">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 w-fit border border-primary/20">
                <Sparkles className="w-3 h-3 mr-2" />
                AI Business Architect
              </div>
              <CardTitle className="text-3xl font-black text-foreground tracking-tight">
                Instantiate New Workspace
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2 font-medium opacity-70">
                Define the parameters of your venture. Branda AI will synthesize the operational bedrock.
              </p>
            </CardHeader>
            <CardContent className="p-10 pt-4">
              <form id="new-workspace-form" onSubmit={handleFormSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Business Domain / Niche</Label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors z-10" />
                      <Input
                        disabled={isGenerating}
                        {...register("niche")}
                        placeholder="e.g. Quantum Coffee, SaaS"
                        className={cn("pl-10 h-12 bg-background/50 border-input font-bold focus:ring-primary shadow-sm", errors.niche && "border-destructive focus-visible:ring-destructive")}
                      />
                    </div>
                    {errors.niche && <p className="text-[10px] font-bold text-destructive mt-2 uppercase tracking-wide">{errors.niche.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Operational Region</Label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors z-10" />
                      <Input
                        disabled={isGenerating}
                        {...register("country")}
                        placeholder="e.g. Global, Switzerland"
                        className={cn("pl-10 h-12 bg-background/50 border-input font-bold focus:ring-primary shadow-sm", errors.country && "border-destructive focus-visible:ring-destructive")}
                      />
                    </div>
                    {errors.country && <p className="text-[10px] font-bold text-destructive mt-2 uppercase tracking-wide">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Designation (Optional)</Label>
                  <div className="relative group">
                    <PenTool className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors z-10" />
                    <Input
                      disabled={isGenerating}
                      {...register("businessName")}
                      placeholder="Have a label in mind?"
                      className="pl-10 h-12 bg-background/50 border-input font-bold focus:ring-primary shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Genesis Details</Label>
                  <Textarea
                    disabled={isGenerating}
                    {...register("details")}
                    rows={4}
                    placeholder="Elaborate on your unique value prop, target demographics, and initial constraints..."
                    className={cn("resize-none p-4 bg-background/50 border-input font-medium focus:ring-primary shadow-sm", errors.details && "border-destructive focus-visible:ring-destructive")}
                  />
                  {errors.details && <p className="text-[10px] font-bold text-destructive mt-2 uppercase tracking-wide">{errors.details.message}</p>}
                </div>
              </form>
            </CardContent>
            <CardFooter className="p-10 pt-0 flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => onSwitchWorkspace(workspaces[0]?.id || '')}
                disabled={isGenerating}
                className="font-bold uppercase tracking-widest text-xs hover:bg-muted"
              >
                Abort
              </Button>
              <Button
                type="submit"
                form="new-workspace-form"
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[220px] h-12 font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-4 w-4 text-primary-foreground/50" />
                    Initialize Venture
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-all duration-500 overflow-hidden relative">

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-[2px]" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:relative md:translate-x-0 border-r border-border
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          workspaces={workspaces}
          currentWorkspaceId={currentWorkspaceId}
          onSwitchWorkspace={onSwitchWorkspace}
          onCreateWorkspace={onCreateWorkspace}
          onLogout={onLogout}
          userName={user.name}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {!currentWorkspace ? (
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-muted/20 relative">
            <EmptyState onCreateClick={onCreateWorkspace} />
          </main>
        ) : (
          <>
            {/* Top Navigation for Views */}
            <header className="bg-card/50 backdrop-blur-md border-b border-border px-6 md:px-10 py-6 flex flex-col gap-6 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                    onClick={() => setIsMobileSidebarOpen(true)}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase">{currentWorkspace.name}</h1>
                      <Badge variant="outline" className="px-3 py-1 font-black text-[10px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                        {currentUserRole}
                      </Badge>
                      <Badge variant="default" className="px-3 py-1 font-black text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-none">
                        {tier} Tier
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 font-bold italic tracking-tight opacity-60 truncate max-w-[200px] md:max-w-md">“{currentWorkspace.plan.brandIdentity.slogan}”</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <InboxComponent user={user} />
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                    {isMutating > 0 ? (
                      <>
                        <Loader2 className="w-3 h-3 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Syncing</span>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Saved</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <nav className="flex space-x-1.5 bg-muted/30 p-1.5 rounded-xl border border-border/50 overflow-x-auto no-scrollbar shadow-inner">
                {(['brand', 'marketing', 'systems', 'crm', 'integrations', 'funding', 'team', 'brainstorming'] as ViewType[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => handleSetView(view)}
                    className={`px-5 py-2.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${activeView === view
                      ? 'bg-background text-primary shadow-md ring-1 ring-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                  >
                    {view}
                  </button>
                ))}
              </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto p-6 md:p-10 bg-muted/10 relative">
              <div className={`max-w-7xl mx-auto transition-all duration-500 ${isLocked ? 'blur-2xl pointer-events-none select-none opacity-20' : ''}`}>
                {activeView === 'brand' && <BrandView plan={currentWorkspace.plan} onUpdate={handleUpdatePlan} isReadOnly={isReadOnly} />}
                {activeView === 'marketing' && <MarketingView plan={currentWorkspace.plan} onUpdate={handleUpdatePlan} isReadOnly={isReadOnly} />}
                {activeView === 'systems' && <SystemsView plan={currentWorkspace.plan} onUpdate={handleUpdatePlan} isReadOnly={isReadOnly} />}
                {activeView === 'crm' && <CRMView plan={currentWorkspace.plan} onUpdate={handleUpdatePlan} isReadOnly={isReadOnly} />}
                {activeView === 'integrations' && (
                  <IntegrationsView
                    workspaceId={currentWorkspace.id}
                    integrations={currentWorkspace.integrations}
                    isReadOnly={!canManageIntegrations}
                  />
                )}
                {activeView === 'funding' && (
                  <FundingView plan={currentWorkspace.plan} onUpdate={handleUpdatePlan} isReadOnly={isReadOnly} />
                )}
                {activeView === 'team' && (
                  <TeamView
                    workspace={currentWorkspace}
                    onUpdateWorkspace={onUpdateWorkspace}
                    currentUserEmail={user.email}
                  />
                )}
                {activeView === 'brainstorming' && (
                  <BrainstormingView plan={currentWorkspace.plan} />
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
};