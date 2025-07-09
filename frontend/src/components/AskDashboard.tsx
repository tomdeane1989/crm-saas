import React, { useState } from "react";
import { useAskDashboard } from "../hooks/useAskDashboard";

export default function AskDashboard() {
  const [query, setQuery] = useState("");
  const mutation = useAskDashboard();

  return (
    <div style={{ padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Ask Dashboard</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="e.g. Show me opps closing this month over £10k"
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          onClick={() => mutation.mutate(query)}
          disabled={mutation.isLoading}
          style={{ padding: "8px 16px", borderRadius: 4, cursor: "pointer" }}
        >
          {mutation.isLoading ? "Asking…" : "Ask"}
        </button>
      </div>
      {mutation.data && (
        <pre style={{ marginTop: 12, padding: 8, background: "#fff", borderRadius: 4 }}>
          {JSON.stringify(mutation.data, null, 2)}
        </pre>
      )}
    </div>
  );
}