import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { Workspace } from '../lib/types';
import { useAuth } from '@/lib/auth-client';

// Query Keys
export const workspaceKeys = {
  all: ['workspaces'] as const,
  detail: (id: string) => [...workspaceKeys.all, id] as const,
};

// Fetch all workspaces for user
export const useWorkspaces = () => {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: async () => {
      const token = await getToken();
      const result = await api.get<{ data: Workspace[] }>('/workspaces', { token });
      return result.data;
    },
    enabled: !!isSignedIn,
  });
};

// Create new workspace
export const useCreateWorkspace = () => {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: Partial<Workspace>) => {
      const token = await getToken();
      const result = await api.post<{ data: Workspace }>('/workspaces/new', data, { token });
      return result.data;
    },
    onSuccess: (newWorkspace) => {
      queryClient.setQueryData(workspaceKeys.all, (old: Workspace[] = []) => [
        ...old,
        newWorkspace
      ]);
    },
  });
};

// Update workspace
export const useUpdateWorkspace = () => {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Workspace> }) => {
      const token = await getToken();
      const result = await api.put<{ data: Workspace }>(`/workspaces/${id}`, data, { token });
      return result.data;
    },
    onSuccess: (updatedWorkspace) => {
      queryClient.setQueryData(workspaceKeys.all, (old: Workspace[] = []) =>
        old.map((w) => w.id === updatedWorkspace.id ? updatedWorkspace : w)
      );
      queryClient.setQueryData(workspaceKeys.detail(updatedWorkspace.id), updatedWorkspace);
    },
  });
};

// Delete workspace
export const useDeleteWorkspace = () => {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return api.delete(`/workspaces/${id}`, { token });
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(workspaceKeys.all, (old: Workspace[] = []) =>
        old.filter((w) => w.id !== id)
      );
    },
  });
};

