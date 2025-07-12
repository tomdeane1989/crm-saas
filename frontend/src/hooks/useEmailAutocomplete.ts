import { useMutation } from '@tanstack/react-query';

export function useEmailAutocomplete() {
  return useMutation({
    mutationFn: (prompt: string) =>
      fetch('/api/ai/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      }).then(res => res.text()),
  });
}