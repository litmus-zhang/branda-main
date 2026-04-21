'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/pages/LandingPage';
import { Dashboard } from '@/components/pages/Dashboard';
import { Workspace } from '@/lib/types';
import { generateBusinessPlan } from '@/lib/services/geminiService';
import { Loader2 } from 'lucide-react';
import {
  useWorkspaces,
  useCreateWorkspace,
  useUpdateWorkspace
} from '@/hooks/useWorkspaces';
import { useAuth, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isPending: isAuthLoading } = useAuth();
  const router = useRouter();



  // TanStack Query Hooks
  const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useWorkspaces();
  const createWorkspaceMutation = useCreateWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [pendingWorkspace, setPendingWorkspace] = useState<Workspace | null>(null);

  // Set initial workspace
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspaceId) {
      setCurrentWorkspaceId(workspaces[0]!.id);
    }
  }, [workspaces, currentWorkspaceId]);

  // Handle pending workspace when user signs in
  useEffect(() => {
    if (user && pendingWorkspace) {
      const email = user.email;
      const wsWithOwner = {
        ...pendingWorkspace,
        collaborators: [{
          id: crypto.randomUUID(),
          email: email || '',
          role: 'owner' as const,
          status: 'active' as const,
          invitedAt: new Date().toISOString()
        }]
      };

      createWorkspaceMutation.mutate(wsWithOwner, {
        onSuccess: (createdWs) => {
          setCurrentWorkspaceId(createdWs.id);
          setPendingWorkspace(null);
        }
      });
    }
  }, [user, pendingWorkspace, createWorkspaceMutation]);

  const handleGenerate = async (formData: { niche: string; businessName: string; details: string; country: string }) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const plan = await generateBusinessPlan(formData);

      const newWorkspace: Partial<Workspace> = {
        id: crypto.randomUUID(),
        name: plan.brandIdentity.name || formData.businessName || 'New Brand',
        plan: plan,
        integrations: [],
        collaborators: [],
        createdAt: new Date().toISOString(),
        tier: 'Free'
      };

      if (!user) {
        setPendingWorkspace(newWorkspace as Workspace);
        router.push('/auth/sign-in');
      } else {
        createWorkspaceMutation.mutate(newWorkspace, {
          onSuccess: (createdWs) => {
            setCurrentWorkspaceId(createdWs.id);
          }
        });
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError("Failed to generate your business plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSwitchWorkspace = (id: string) => {
    setCurrentWorkspaceId(id);
  };

  const handleUpdateWorkspace = (updatedWorkspace: Workspace) => {
    updateWorkspaceMutation.mutate({
      id: updatedWorkspace.id,
      data: updatedWorkspace
    });
  };

  const handleCreateNewWorkspace = () => {
    setCurrentWorkspaceId('new');
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

  if (isAuthLoading || isLoadingWorkspaces) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (user) {
    return (
      <Dashboard
        user={{ name: user.name || '', email: user.email || '' }}
        workspaces={workspaces}
        currentWorkspaceId={currentWorkspaceId}
        onSwitchWorkspace={handleSwitchWorkspace}
        onCreateWorkspace={handleCreateNewWorkspace}
        onUpdateWorkspace={handleUpdateWorkspace}
        onLogout={async () => {
          await authClient.signOut();
          router.refresh();
        }}
        onGenerateNew={handleGenerate}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <LandingPage onGenerate={handleGenerate} error={generationError} />
  );
}
