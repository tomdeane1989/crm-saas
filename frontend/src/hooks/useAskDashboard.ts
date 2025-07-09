import { useMutation } from '@tanstack/react-query';

export function useAskDashboard() {
  return useMutation((query: string) =>
    fetch('/api/ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then(res => res.json()),
  );
}
