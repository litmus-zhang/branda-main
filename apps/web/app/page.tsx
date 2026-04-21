'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/pages/LandingPage';
import { Workspace } from '@/lib/types';
import { generateBusinessPlan } from '@/lib/services/geminiService';
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
  const createWorkspaceMutation = useCreateWorkspace();

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [pendingWorkspace, setPendingWorkspace] = useState<Workspace | null>(null);


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


  return (
    <LandingPage onGenerate={handleGenerate} error={generationError} />
  );
}
