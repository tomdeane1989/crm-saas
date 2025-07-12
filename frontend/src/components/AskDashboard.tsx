import { useState } from "react";
import { useAskDashboard } from "../hooks/useAskDashboard";
import { useAuth } from "../contexts/AuthContext";

export default function AskDashboard() {
  const [query, setQuery] = useState("");
  const mutation = useAskDashboard();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-700">Please log in to use the AI assistant.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="e.g. Show me opportunities closing this month over $10k"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !mutation.isPending) {
              mutation.mutate(query);
            }
          }}
        />
        <button
          onClick={() => mutation.mutate(query)}
          disabled={mutation.isPending || !query.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Asking..." : "Ask"}
        </button>
      </div>

      {mutation.error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>Error: {mutation.error.message || 'Failed to process your request'}</p>
        </div>
      )}

      {mutation.data && (
        <div className="mt-3 space-y-3">
          {mutation.data.response && (
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{mutation.data.response}</div>
              </div>
            </div>
          )}
          
          {mutation.data.data && (
            <details className="p-3 bg-gray-100 border border-gray-200 rounded-md">
              <summary className="cursor-pointer font-medium text-gray-700">
                View raw data
              </summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {JSON.stringify(mutation.data.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}