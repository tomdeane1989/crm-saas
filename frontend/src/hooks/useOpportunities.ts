import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

export interface Opportunity {
  id: number;
  title: string;
  amount?: number;
  status: string;
  closeDate?: string;
  externalId?: string;
  customFields?: Record<string, any>;
  companyId: number;
  contactId?: number;
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
  _count?: {
    activities: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityDto {
  title: string;
  amount?: number;
  status: string;
  closeDate?: string;
  externalId?: string;
  customFields?: Record<string, any>;
  companyId: number;
  contactId?: number;
}

export interface OpportunityFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  companyId?: number;
  contactId?: number;
  minAmount?: number;
  maxAmount?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface OpportunitiesResponse {
  data: Opportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    totalPages: number;
  };
}

const API_BASE = '/api/opportunities';

// Opportunity status constants
export const OPPORTUNITY_STATUSES = [
  { value: 'prospect', label: 'Prospect', color: 'bg-gray-100 text-gray-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { value: 'proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { value: 'closed-won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { value: 'closed-lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
];

// Query hooks
export function useOpportunities(filters: OpportunityFilters) {
  const { token } = useAuth();
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<OpportunitiesResponse>({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
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

export function useOpportunity(id: number) {
  const { token } = useAuth();
  
  return useQuery<Opportunity>({
    queryKey: ['opportunities', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch opportunity');
      }
      
      return response.json();
    },
    enabled: !!id && !!token,
  });
}

// Mutation hooks
export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateOpportunityDto) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create opportunity');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateOpportunityDto> }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update opportunity');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useDeleteOpportunity() {
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
        throw new Error('Failed to delete opportunity');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useBulkDeleteOpportunities() {
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
        throw new Error('Failed to bulk delete opportunities');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useBulkUpdateOpportunities() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: Partial<CreateOpportunityDto> }) => {
      const response = await fetch(`${API_BASE}/bulk-update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ ids, data }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk update opportunities');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}
