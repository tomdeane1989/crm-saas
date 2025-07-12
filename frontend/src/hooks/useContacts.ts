import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  externalId?: string;
  customFields?: Record<string, any>;
  companyId: number;
  company?: {
    id: number;
    name: string;
    industry?: string;
  };
  _count?: {
    activities: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  externalId?: string;
  customFields?: Record<string, any>;
  companyId: number;
}

export interface ContactFilters {
  page: number;
  limit: number;
  search: string;
  role: string;
  companyId?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ContactsResponse {
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    totalPages: number;
  };
}

const API_BASE = '/api/contacts';

// Query hooks
export function useContacts(filters: ContactFilters) {
  const { token } = useAuth();
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<ContactsResponse>({
    queryKey: ['contacts', filters],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
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

export function useContact(id: number) {
  const { token } = useAuth();
  
  return useQuery<Contact>({
    queryKey: ['contacts', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }
      
      return response.json();
    },
    enabled: !!id && !!token,
  });
}

// Mutation hooks
export function useCreateContact() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateContactDto) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create contact');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateContactDto> }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
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
        throw new Error('Failed to delete contact');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useBulkDeleteContacts() {
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
        throw new Error('Failed to bulk delete contacts');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useBulkUpdateContacts() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: Partial<CreateContactDto> }) => {
      const response = await fetch(`${API_BASE}/bulk-update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ ids, data }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk update contacts');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
