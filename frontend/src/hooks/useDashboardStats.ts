import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalCompanies: number;
  totalContacts: number;
  totalOpportunities: number;
  totalActivities: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // stub data—backend not wired yet
      return {
        totalCompanies: 0,
        totalContacts: 0,
        totalOpportunities: 0,
        totalActivities: 0,
      };
    },
  });
}
