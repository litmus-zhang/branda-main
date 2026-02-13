
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { BusinessPlan } from '../types';

export const useGeneratePlan = () => {
  return useMutation({
    mutationFn: (data: { niche: string; businessName: string; details: string; country: string }) => 
      api.post<BusinessPlan>('/ai/generate-plan', data)
  });
};

export const useBrainstorm = () => {
  return useMutation({
    mutationFn: (data: { workspaceId: string; message: string; chatHistory: any[] }) =>
        api.post<{ text: string }>('/ai/brainstorm', data)
  });
};
