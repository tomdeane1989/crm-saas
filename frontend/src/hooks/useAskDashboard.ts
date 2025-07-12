import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

interface AskResponse {
  query: string;
  response: string;
  data: any;
  timestamp: string;
}

export function useAskDashboard() {
  const { token } = useAuth();
  
  return useMutation<AskResponse, Error, string>({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search');
      }
      
      return response.json();
    }
  });
}
