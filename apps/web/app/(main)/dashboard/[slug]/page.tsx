"use client"
import { useWorkspaces, useCreateWorkspace, useUpdateWorkspace } from '@/hooks/useWorkspaces';
import { useAuth } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/pages/Dashboard';
import { generateBusinessPlan } from '@/lib/services/geminiService';
import { Workspace, ViewType } from '@/lib/types';
import { slugify } from '@branda/ui/lib/utils';
import { authClient } from '@/lib/auth-client';

export default function WorkspaceDashboardPage() {
    const { user, isPending: isAuthLoading } = useAuth();
    const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useWorkspaces();
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = params.slug as string;

    const createWorkspaceMutation = useCreateWorkspace();
    const updateWorkspaceMutation = useUpdateWorkspace();

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);

    // Sync currentWorkspaceId with the slug from URL
    useEffect(() => {
        if (workspaces.length > 0 && slug) {
            const ws = workspaces.find(w => w.slug === slug);
            if (ws) {
                setCurrentWorkspaceId(ws.id);
            } else if (slug === 'new') {
                setCurrentWorkspaceId('new');
            }
        }
    }, [workspaces, slug]);

    const handleSwitchWorkspace = (id: string) => {
        const ws = workspaces.find(w => w.id === id);
        if (ws) {
            router.push(`/dashboard/${ws.slug}?view=${searchParams.get('view') || 'brand'}`);
        } else if (id === 'new') {
            router.push('/dashboard/new');
        }
    };

    const handleUpdateWorkspace = (updatedWorkspace: Workspace) => {
        updateWorkspaceMutation.mutate({
            id: updatedWorkspace.id,
            data: updatedWorkspace
        });
    };

    const handleCreateNewWorkspace = () => {
        router.push('/dashboard/new');
    };

    const handleGenerate = async (formData: { niche: string; businessName: string; details: string; country: string }) => {
        setIsGenerating(true);
        setGenerationError(null);
        try {
            const plan = await generateBusinessPlan(formData);
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
            setGenerationError("Failed to generate your business plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isAuthLoading || isLoadingWorkspaces) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user) return null;

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
                router.push('/auth/sign-in');
            }}
            onGenerateNew={handleGenerate}
            isGenerating={isGenerating}
        />
    );
}
