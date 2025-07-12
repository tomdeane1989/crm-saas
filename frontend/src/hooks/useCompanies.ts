import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../contexts/AuthContext';

export interface Company {
  id: number;
  name: string;
  website?: string;
  industry?: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  contacts?: any[];
  opportunities?: any[];
  _count?: {
    contacts: number;
    opportunities: number;
  };
}

export interface CompanyFilters {
  page: number;
  limit: number;
  search: string;
  industry: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCompanyDto {
  name: string;
  industry?: string;
  website?: string;
  customFields?: Record<string, any>;
}

export function useCompanies(filters: CompanyFilters) {
  const { token } = useAuth();
  
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  return useQuery<PaginatedResponse<Company>>({
    queryKey: ["companies", filters],
    queryFn: async () => {
      const res = await fetch(`/api/companies?${queryParams.toString()}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (!res.ok) throw new Error("Failed to fetch companies");
      const result = await res.json();
      // Add totalPages for compatibility with DataTable
      if (result.pagination) {
        result.pagination.totalPages = result.pagination.totalPages || result.pagination.pages;
      }
      return result;
    },
    enabled: !!token,
  });
}

export function useCompany(id: number) {
  const { token } = useAuth();
  
  return useQuery<Company>({
    queryKey: ["companies", id],
    queryFn: async () => {
      const res = await fetch(`/api/companies/${id}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (!res.ok) throw new Error("Failed to fetch company");
      return res.json();
    },
    enabled: !!token && !!id,
  });
}

export function useCreateCompany() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation<Company, Error, CreateCompanyDto>({
    mutationFn: async (data) => {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create company");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation<Company, Error, { id: number; data: Partial<CreateCompanyDto> }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update company");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.setQueryData(["companies", data.id], data);
    },
  });
}

export function useDeleteCompany() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      if (!res.ok) throw new Error("Failed to delete company");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useBulkDeleteCompanies() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number[]>({
    mutationFn: async (ids) => {
      const res = await fetch("/api/companies/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Failed to delete companies");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}