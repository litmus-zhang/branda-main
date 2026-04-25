"use client"
import { useAuth } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dashboard } from '@/components/pages/Dashboard';
import { useCreateWorkspace, useUpdateWorkspace, useWorkspaces } from '@/hooks/useWorkspaces';
import { useGeneratePlan } from '@/hooks/useAi';
import { authClient } from '@/lib/auth-client';
import { Workspace } from '@/lib/types';
import { useState } from 'react';
import { slugify } from '@branda/ui/lib/utils';


export default function DashboardPage() {
    const { user, isPending: isAuthLoading } = useAuth();
    const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useWorkspaces();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !isLoadingWorkspaces && user) {
            if (workspaces.length > 0) {
                router.replace(`/dashboard/${workspaces[0]?.slug}`);
            }
        }
    }, [workspaces, isAuthLoading, isLoadingWorkspaces, user, router]);

    // If loading or we have workspaces (about to redirect), show loader
    if (isAuthLoading || isLoadingWorkspaces || (user && workspaces.length > 0)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    // If user is logged in but has NO workspaces, show the dashboard in "empty" mode
    if (user && workspaces.length === 0) {
        return (
            <DashboardContent
                user={{ name: user.name || '', email: user.email || '' }}
                workspaces={[]}
                currentWorkspaceId={null}
            />
        );
    }

    return null;
}

// Separate component for the dashboard content logic to reuse
function DashboardContent({ user, workspaces, currentWorkspaceId: initialId }: { user: any, workspaces: Workspace[], currentWorkspaceId: string | null }) {
    const createWorkspaceMutation = useCreateWorkspace();
    const updateWorkspaceMutation = useUpdateWorkspace();
    const generatePlanMutation = useGeneratePlan();
    const router = useRouter();

    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(initialId);

    const handleSwitchWorkspace = (id: string) => {
        const ws = workspaces.find(w => w.id === id);
        if (ws) {
            router.push(`/dashboard/${ws.slug}`);
        } else if (id === 'new') {
            setCurrentWorkspaceId('new');
        }
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
            user={user}
            workspaces={workspaces}
            currentWorkspaceId={currentWorkspaceId}
            onSwitchWorkspace={handleSwitchWorkspace}
            onCreateWorkspace={handleCreateNewWorkspace}
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