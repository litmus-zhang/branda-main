"use client"
import { useWorkspaces, useCreateWorkspace, useUpdateWorkspace } from '@/hooks/useWorkspaces';
import { useAuth } from '@/lib/auth-client';
import { useGeneratePlan } from '@/hooks/useAi';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dashboard } from '@/components/pages/Dashboard';
import { Workspace } from '@/lib/types';
import { slugify } from '@branda/ui/lib/utils';
import { authClient } from '@/lib/auth-client';

export default function NewWorkspacePage() {
    const { user, isPending: isAuthLoading } = useAuth();
    const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useWorkspaces();
    const router = useRouter();

    const createWorkspaceMutation = useCreateWorkspace();
    const updateWorkspaceMutation = useUpdateWorkspace();
    const generatePlanMutation = useGeneratePlan();

    useEffect(() => {
        if (!isAuthLoading && !isLoadingWorkspaces && !user) {
            router.push('/auth/sign-in');
        }
    }, [user, isAuthLoading, isLoadingWorkspaces, router]);

    if (isAuthLoading || isLoadingWorkspaces) {
        return <LoadingScreen message="Preparing architect..." />;
    }

    if (!user) {
        return null;
    }

    const handleSwitchWorkspace = (id: string) => {
        const ws = workspaces.find(w => w.id === id);
        if (ws) {
            router.push(`/dashboard/${ws.slug}`);
        }
    };

    const handleUpdateWorkspace = (updatedWorkspace: Workspace) => {
        updateWorkspaceMutation.mutate({
            id: updatedWorkspace.id,
            data: updatedWorkspace
        });
    };

    const handleGenerate = async (formData: { niche: string; businessName: string; details: string; country: string }) => {
        try {
            const plan = await generatePlanMutation.mutateAsync(formData);
            const name = plan.brandIdentity.name || formData.businessName || 'New Brand';

            const newWorkspace: Partial<Workspace> = {
                id: crypto.randomUUID(),
                name,
                slug: slugify(name),
                plan: plan,
                integrations: [],
                collaborators: [],
                createdAt: new Date().toISOString(),
                tier: 'Free'
            };

            await createWorkspaceMutation.mutateAsync(newWorkspace, {
                onSuccess: (createdWs) => {
                    router.push(`/dashboard/${createdWs.slug}`);
                }
            });
        } catch (error) {
            console.error("Generation failed:", error);
        }
    };

    return (
        <Dashboard
            user={{ name: user.name || '', email: user.email || '' }}
            workspaces={workspaces}
            currentWorkspaceId="new"
            onSwitchWorkspace={handleSwitchWorkspace}
            onCreateWorkspace={() => router.push('/dashboard/new')}
            onUpdateWorkspace={handleUpdateWorkspace}
            onLogout={async () => {
                await authClient.signOut();
                router.push('/auth/sign-in');
            }}
            onGenerateNew={handleGenerate}
            isGenerating={generatePlanMutation.isPending}
        />
    );
}
