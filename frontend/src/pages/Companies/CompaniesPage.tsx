import { useCompanies } from "../../hooks/useCompanies";

export default function CompaniesPage() {
  const { data, isLoading, isError, error } = useCompanies();

  if (isLoading) return <div>Loading companies…</div>;
  if (isError) return <div>Error: {String(error)}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <ul className="space-y-2">
        {data!.map((c) => (
          <li key={c.id} className="p-2 border rounded">
            <div className="font-semibold">{c.name}</div>
            {c.website && (
              <a href={c.website} target="_blank" className="text-sm text-blue-500">
                {c.website}
              </a>
            )}
            {c.industry && <div className="text-sm">{c.industry}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
