import React, { useState } from 'react';
import { useAskDashboard } from '../hooks/useAskDashboard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AskDashboard() {
  const [query, setQuery] = useState('');
  const mutation = useAskDashboard();

  const handleAsk = () => mutation.mutate(query);

  return (
    <Card className="p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Ask Dashboard</h2>
      <div className="flex space-x-2">
        <Input
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
          placeholder="e.g. Show me opps closing this month over £10k"
        />
        <Button onClick={handleAsk} disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Asking…' : 'Ask'}
        </Button>
      </div>
      {mutation.data && (
        <CardContent className="mt-4 whitespace-pre-wrap">
          {JSON.stringify(mutation.data, null, 2)}
        </CardContent>
      )}
    </Card>
  );
}
