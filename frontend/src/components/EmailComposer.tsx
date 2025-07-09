import React, { useState } from 'react';
import { useEmailAutocomplete } from '../hooks/useEmailAutocomplete';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function EmailComposer() {
  const [draft, setDraft] = useState('');
  const mutation = useEmailAutocomplete();

  const handleAutocomplete = async () => {
    const suggestion = await mutation.mutateAsync(draft);
    setDraft(prev => prev + '\n\n' + suggestion);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Email Composer</h2>
      <Textarea
        value={draft}
        onChange={e => setDraft(e.currentTarget.value)}
        rows={8}
        placeholder="Write your email draft here..."
      />
      <Button onClick={handleAutocomplete} disabled={mutation.isLoading} className="mt-2">
        {mutation.isLoading ? 'Generating…' : 'Autocomplete'}
      </Button>
    </div>
  );
}
