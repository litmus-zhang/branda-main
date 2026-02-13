import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Workspace } from './types';
import { generateBusinessPlan } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [pendingWorkspace, setPendingWorkspace] = useState<Workspace | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('branda_user');
    const storedWorkspaces = localStorage.getItem('branda_workspaces');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedWorkspaces) {
      const parsedWorkspaces = JSON.parse(storedWorkspaces);
      
      // Migration: Ensure keyChannels is an array of objects, not strings
      // Also ensure tier exists
      const migratedWorkspaces = parsedWorkspaces.map((ws: any) => {
        const keyChannels = ws.plan.marketing.keyChannels || [];
        const migratedChannels = keyChannels.map((c: any) => {
            if (typeof c === 'string') {
                return { name: c, url: '' };
            }
            return c;
        });

        return {
            ...ws,
            tier: ws.tier || 'Free', // Default to Free if undefined
            plan: {
                ...ws.plan,
                marketing: {
                    ...ws.plan.marketing,
                    keyChannels: migratedChannels
                }
            }
        };
      });

      setWorkspaces(migratedWorkspaces);
      if (migratedWorkspaces.length > 0) {
        setCurrentWorkspaceId(migratedWorkspaces[0].id);
      }
    }
  }, []);

  // Save workspaces whenever they change
  useEffect(() => {
    if (workspaces.length > 0) {
      localStorage.setItem('branda_workspaces', JSON.stringify(workspaces));
    }
  }, [workspaces]);

  const handleGenerate = async (formData: { niche: string; businessName: string; details: string; country: string }) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const plan = await generateBusinessPlan(formData);
      
      const newWorkspace: Workspace = {
        id: crypto.randomUUID(),
        name: plan.brandIdentity.name || formData.businessName || 'New Brand',
        plan: plan,
        integrations: [],
        collaborators: [], // Initialize empty collaborators
        createdAt: new Date().toISOString(),
        tier: 'Free' // Default tier
      };

      if (!user) {
        // If no user, store pending and show auth
        setPendingWorkspace(newWorkspace);
        setShowAuthModal(true);
      } else {
        // If user exists, add directly
        setWorkspaces(prev => [...prev, newWorkspace]);
        setCurrentWorkspaceId(newWorkspace.id);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError("Failed to generate your business plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('branda_user', JSON.stringify(newUser));
    setShowAuthModal(false);

    if (pendingWorkspace) {
      // Add user as owner
      const wsWithOwner = {
        ...pendingWorkspace,
        collaborators: [{
            id: crypto.randomUUID(),
            email: email,
            role: 'owner' as const,
            status: 'active' as const,
            invitedAt: new Date().toISOString()
        }]
      };
      setWorkspaces([wsWithOwner]);
      setCurrentWorkspaceId(wsWithOwner.id);
      setPendingWorkspace(null);
    }
  };

  const handleSwitchWorkspace = (id: string) => {
    setCurrentWorkspaceId(id);
  };

  const handleUpdateWorkspace = (updatedWorkspace: Workspace) => {
    setWorkspaces(prev => prev.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w));
  };

  const handleCreateNewWorkspace = () => {
    setCurrentWorkspaceId('new'); 
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentWorkspaceId(null);
    localStorage.removeItem('branda_user');
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Building your Empire...</h2>
        <p className="text-slate-600 mt-2">Our AI is crafting your brand assets, marketing strategy, and systems.</p>
      </div>
    );
  }

  // If user is logged in
  if (user) {
    return (
      <Dashboard
        user={user}
        workspaces={workspaces}
        currentWorkspaceId={currentWorkspaceId}
        onSwitchWorkspace={handleSwitchWorkspace}
        onCreateWorkspace={handleCreateNewWorkspace}
        onUpdateWorkspace={handleUpdateWorkspace}
        onLogout={handleLogout}
        onGenerateNew={handleGenerate}
        isGenerating={isGenerating} 
      />
    );
  }

  // Default: Landing Page
  return (
    <>
      <LandingPage onGenerate={handleGenerate} error={generationError} />
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">Save your Workspace</h2>
            <p className="text-slate-600 mb-6">Your business plan for <span className="font-semibold text-primary-600">{pendingWorkspace?.name}</span> is ready. Create an account to access it.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleLogin(formData.get('name') as string, formData.get('email') as string);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Elon Musk" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required name="email" type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="elon@example.com" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                Claim Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;