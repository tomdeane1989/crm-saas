// frontend/src/pages/Activities/ActivitiesPage.tsx

import { useActivities } from "../../hooks/useActivities";

export default function ActivitiesPage() {
  const { data, isLoading, isError, error } = useActivities();

  if (isLoading) return <div>Loading activities…</div>;
  if (isError) return <div>Error: {String(error)}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <ul className="space-y-2">
        {data!.map((a) => (
          <li key={a.id} className="p-2 border rounded">
            <div className="font-semibold">{a.type}</div>
            <div className="text-sm">
              {new Date(a.occurredAt).toLocaleString()}
            </div>
            {a.notes && <div className="text-sm italic">{a.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}