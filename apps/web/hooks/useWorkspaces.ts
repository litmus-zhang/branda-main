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
    onMutate: async (updatedWorkspace) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: workspaceKeys.all });

      // Snapshot the previous value
      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(workspaceKeys.all);

      // Optimistically update to the new value
      queryClient.setQueryData(workspaceKeys.all, (old: Workspace[] = []) =>
        old.map((w) => w.id === updatedWorkspace.id ? { ...w, ...updatedWorkspace.data } : w)
      );

      // Return a context object with the snapshotted value
      return { previousWorkspaces };
    },
    onError: (err, newWorkspace, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(workspaceKeys.all, context.previousWorkspaces);
      }
    },
    onSettled: (updatedWorkspace) => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      if (updatedWorkspace) {
        queryClient.setQueryData(workspaceKeys.detail(updatedWorkspace.id), updatedWorkspace);
      }
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

