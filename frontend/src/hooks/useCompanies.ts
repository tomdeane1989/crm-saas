import { useQuery } from "@tanstack/react-query";

export interface Company {
  id: number;
  name: string;
  website?: string;
  industry?: string;
}

export function useCompanies() {
  return useQuery<Company[]>(["companies"], async () => {
    const res = await fetch("/api/companies");
    if (!res.ok) throw new Error("Failed to fetch companies");
    return res.json();
  });
}
