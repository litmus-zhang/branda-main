
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { Workspace } from '../types';
import { useAuthStore } from '../stores/authStore';

// Query Keys
export const workspaceKeys = {
  all: ['workspaces'] as const,
  detail: (id: string) => [...workspaceKeys.all, id] as const,
};

// Fetch all workspaces for user
export const useWorkspaces = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: async () => {
       return api.get<Workspace[]>('/workspaces');
    },
    enabled: isAuthenticated,
  });
};

// Create new workspace
export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: (data: { name: string; country: string; niche: string }) => 
      api.post<Workspace>('/workspaces', data),
    onSuccess: (newWorkspace) => {
      queryClient.setQueryData(workspaceKeys.all, (old: Workspace[] = []) => [
        ...old, 
        newWorkspace
      ]);
    },
  });
};

// Update workspace (tier, name)
export const useUpdateWorkspace = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workspace> }) => 
      api.patch<Workspace>(`/workspaces/${id}`, data),
    onSuccess: (updatedWorkspace) => {
      // Update list cache
      queryClient.setQueryData(workspaceKeys.all, (old: Workspace[] = []) => 
        old.map((w) => w.id === updatedWorkspace.id ? updatedWorkspace : w)
      );
      // Update detail cache if it exists
      queryClient.setQueryData(workspaceKeys.detail(updatedWorkspace.id), updatedWorkspace);
    },
  });
};

// Invite Member
export const useInviteMember = () => {
  return useMutation({
    mutationFn: ({ workspaceId, email, role }: { workspaceId: string; email: string; role: string }) =>
      api.post(`/workspaces/${workspaceId}/members/invite`, { email, role }),
    onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.workspaceId) });
       // Also invalidate list as member count/metadata might change
       queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    }
  });
};
