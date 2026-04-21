import React, { useState } from 'react';
import { Workspace, ViewType, BusinessPlan } from '../../lib/types';
import { Sidebar } from '../Sidebar';
import { BrandView } from '../views/BrandView';
import { MarketingView } from '../views/MarketingView';
import { SystemsView } from '../views/SystemsView';
import { CRMView } from '../views/CRMView';
import { IntegrationsView } from '../views/IntegrationsView';
import { TeamView } from '../views/TeamView';
import { BrainstormingView } from '../views/BrainstormingView';
import { FundingView } from '../views/FundingView';
import { PlusCircle, Loader2, Menu, Lock } from 'lucide-react';
import { Button } from "@branda/ui/components/button";
import { Input } from "@branda/ui/components/input";
import { Textarea } from "@branda/ui/components/textarea";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@branda/ui/components/card";
import { Badge } from "@branda/ui/components/badge";


interface DashboardProps {
  user: { name: string; email: string };
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
  const [activeView, setActiveView] = useState<ViewType>('brand');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const isLocked = isFreeTier && activeView !== 'brand';

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

  // New Workspace Creation Form State
  const [newWorkspaceFormData, setNewWorkspaceFormData] = useState({
    niche: '',
    businessName: '',
    details: '',
    country: ''
  });

  const handleNewWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateNew(newWorkspaceFormData);
    setNewWorkspaceFormData({ niche: '', businessName: '', details: '', country: '' });
  };

  if (currentWorkspaceId === 'new') {
    return (
      <div className="flex h-screen bg-slate-50">
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
        <main className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">Generating New Workspace...</h2>
            </div>
          ) : (
            <Card className="max-w-2xl w-full mx-4 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="w-6 h-6 mr-2 text-primary-600" />
                  Create New Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form id="new-workspace-form" onSubmit={handleNewWorkspaceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Niche / Industry</label>
                    <Input
                      required
                      placeholder="e.g. Digital Marketing Agency"
                      value={newWorkspaceFormData.niche}
                      onChange={e => setNewWorkspaceFormData({ ...newWorkspaceFormData, niche: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <Input
                      required
                      placeholder="e.g. Canada"
                      value={newWorkspaceFormData.country}
                      onChange={e => setNewWorkspaceFormData({ ...newWorkspaceFormData, country: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Name (Optional)</label>
                    <Input
                      placeholder="Enter a name or let AI decide"
                      value={newWorkspaceFormData.businessName}
                      onChange={e => setNewWorkspaceFormData({ ...newWorkspaceFormData, businessName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
                    <Textarea
                      required
                      rows={4}
                      placeholder="What kind of business is this? Who are your customers?"
                      value={newWorkspaceFormData.details}
                      onChange={e => setNewWorkspaceFormData({ ...newWorkspaceFormData, details: e.target.value })}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  form="new-workspace-form"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Generate & Create
                </Button>
              </CardFooter>
            </Card>
          )}

        </main>
      </div>
    )
  }

  if (!currentWorkspace) {
    return <div className="p-8">Select a workspace</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
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
        {/* Top Navigation for Views */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">{currentWorkspace.name}</h1>
                  <Badge variant={currentUserRole === 'owner' ? 'default' : 'secondary'} className="capitalize">
                    {currentUserRole}
                  </Badge>
                  <Badge variant={isFreeTier ? 'outline' : 'default'} className="bg-amber-100 text-amber-700 border-amber-300">
                    {tier} Plan
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 truncate max-w-[200px] md:max-w-md">{currentWorkspace.plan.brandIdentity.slogan}</p>
              </div>
            </div>
            {isFreeTier && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpgrade}
                className="hidden md:flex items-center bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              >
                <Lock className="w-3 h-3 mr-1.5" />
                Upgrade to Premium
              </Button>
            )}

          </div>

          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
            {(['brand', 'marketing', 'systems', 'CRM', 'integrations', 'funding', 'team', 'brainstorming'] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap flex-shrink-0 flex items-center ${activeView === view
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                {view}
                {isFreeTier && view !== 'brand' && (
                  <Lock className="w-3 h-3 ml-2 text-slate-400" />
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 relative">
          <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLocked ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>
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

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
              <Card className="max-w-md text-center shadow-2xl border-slate-200">
                <CardHeader>
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    Unlock {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">Upgrade to a premium plan to access advanced features like Marketing Strategy, Systems, CRM, and more.</p>
                  <Button
                    onClick={handleUpgrade}
                    className="w-full py-6 text-lg bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30"
                  >
                    Upgrade Now
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-1">
                  <p className="text-xs text-slate-400">Starts at just $11.99/mo</p>
                </CardFooter>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};