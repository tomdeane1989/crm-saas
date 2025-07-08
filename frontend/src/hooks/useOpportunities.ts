import { useQuery } from "@tanstack/react-query";

export interface Opportunity {
  id: number;
  title: string;
  amount?: number;
  stage: string;
  closeDate?: string;
}

export function useOpportunities() {
  return useQuery<Opportunity[]>(
    ["opportunities"],
    async () => {
      const res = await fetch("/api/opportunities");
      if (!res.ok) throw new Error("Failed to fetch opportunities");
      return res.json();
    }
  );
}
