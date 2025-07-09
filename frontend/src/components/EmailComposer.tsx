import React, { useState } from "react";
import { useEmailAutocomplete } from "../hooks/useEmailAutocomplete";

export default function EmailComposer() {
  const [draft, setDraft] = useState("");
  const mutation = useEmailAutocomplete();

  const handleAutocomplete = async () => {
    const suggestion = await mutation.mutateAsync(draft);
    setDraft((prev) => prev + "\n\n" + suggestion);
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Email Composer</h2>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        rows={8}
        style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        placeholder="Write your email draft here..."
      />
      <button
        onClick={handleAutocomplete}
        disabled={mutation.isLoading}
        style={{ marginTop: 8, padding: "8px 16px", borderRadius: 4, cursor: "pointer" }}
      >
        {mutation.isLoading ? "Generating…" : "Autocomplete"}
      </button>
    </div>
  );
}