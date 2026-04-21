
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { BusinessPlan, Workspace } from '../lib/types';
import { workspaceKeys } from './useWorkspaces';


// We fetch the plan as part of the Workspace object usually, 
// but updates are sectional patches

type PlanSection = 'brand' | 'marketing' | 'systems' | 'crm' | 'funding';

export const useUpdateBusinessPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      section,
      data
    }: {
      workspaceId: string;
      section: PlanSection;
      data: Partial<BusinessPlan[keyof BusinessPlan]>;
    }) =>
      api.patch<BusinessPlan>(`/workspaces/${workspaceId}/plan/${section}`, { [section]: data }),

    onMutate: async ({ workspaceId, section, data }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: workspaceKeys.all });

      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(workspaceKeys.all);

      if (previousWorkspaces) {
        queryClient.setQueryData(workspaceKeys.all, previousWorkspaces.map(ws => {
          if (ws.id === workspaceId) {
            return {
              ...ws,
              plan: {
                ...ws.plan,
                [section]: {
                  ...ws.plan[section], // TS might complain here but logic holds for JSONB partials
                  ...data
                }
              }
            };
          }
          return ws;
        }));
      }

      return { previousWorkspaces };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(workspaceKeys.all, context.previousWorkspaces);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
};
