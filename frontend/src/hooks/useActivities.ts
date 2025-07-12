import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

export interface Activity {
  id: number;
  type: string;
  details?: string;
  occurredAt: string;
  customFields?: Record<string, any>;
  companyId: number;
  contactId?: number;
  opportunityId?: number;
  company?: {
    id: number;
    name: string;
    industry?: string;
  };
  contact?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
  opportunity?: {
    id: number;
    title: string;
    status: string;
    amount?: number;
  };
  createdAt: string;
}

export interface CreateActivityDto {
  type: string;
  details?: string;
  occurredAt?: string;
  customFields?: Record<string, any>;
  companyId: number;
  contactId?: number;
  opportunityId?: number;
}

export interface ActivityFilters {
  page: number;
  limit: number;
  search: string;
  type: string;
  companyId?: number;
  contactId?: number;
  opportunityId?: number;
  startDate?: string;
  endDate?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ActivitiesResponse {
  data: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    totalPages: number;
  };
}

const API_BASE = '/api/activities';

// Activity type constants
export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Phone Call', icon: '📞', color: 'bg-blue-100 text-blue-800' },
  { value: 'email', label: 'Email', icon: '📧', color: 'bg-green-100 text-green-800' },
  { value: 'meeting', label: 'Meeting', icon: '👥', color: 'bg-purple-100 text-purple-800' },
  { value: 'note', label: 'Note', icon: '📝', color: 'bg-gray-100 text-gray-800' },
  { value: 'task', label: 'Task', icon: '✅', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'demo', label: 'Demo', icon: '🖥️', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'follow-up', label: 'Follow-up', icon: '🔄', color: 'bg-orange-100 text-orange-800' },
];

// Query hooks
export function useActivities(filters: ActivityFilters) {
  const { token } = useAuth();
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<ActivitiesResponse>({
    queryKey: ['activities', filters],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const result = await response.json();
      // Add totalPages for compatibility with DataTable
      if (result.pagination) {
        result.pagination.totalPages = result.pagination.pages;
      }
      return result;
    },
    enabled: !!token,
  });
}

export function useActivity(id: number) {
  const { token } = useAuth();
  
  return useQuery<Activity>({
    queryKey: ['activities', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      
      return response.json();
    },
    enabled: !!id && !!token,
  });
}

// Mutation hooks
export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateActivityDto) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create activity');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateActivityDto> }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update activity');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useBulkDeleteActivities() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await fetch(`${API_BASE}/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk delete activities');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useBulkUpdateActivities() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: Partial<CreateActivityDto> }) => {
      const response = await fetch(`${API_BASE}/bulk-update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ ids, data }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk update activities');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}