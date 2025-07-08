import { useQuery } from "@tanstack/react-query";

export interface Activity {
  id: number;
  type: string;
  occurredAt: string;
  notes?: string;
}

export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch("/api/activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
  });
}