import { useOpportunities } from "../../hooks/useOpportunities";

export default function OpportunitiesPage() {
  const { data, isLoading, isError, error } = useOpportunities();

  if (isLoading) return <div>Loading opportunities…</div>;
  if (isError) return <div>Error: {String(error)}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Opportunities</h1>
      <ul className="space-y-2">
        {data!.map((o) => (
          <li key={o.id} className="p-2 border rounded">
            <div className="font-semibold">{o.title}</div>
            <div className="text-sm">Stage: {o.stage}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
