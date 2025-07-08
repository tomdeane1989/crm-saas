import { useQuery } from "@tanstack/react-query";

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export function useContacts() {
  return useQuery<Contact[]>(["contacts"], async () => {
    const res = await fetch("/api/contacts");
    if (!res.ok) throw new Error("Failed to fetch contacts");
    return res.json();
  });
}
