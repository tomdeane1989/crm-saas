import { useContacts } from "../../hooks/useContacts";

export default function ContactsPage() {
  const { data, isLoading, isError, error } = useContacts();

  if (isLoading) return <div>Loading contacts…</div>;
  if (isError) return <div>Error: {String(error)}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <ul className="space-y-2">
        {data!.map((c) => (
          <li key={c.id} className="p-2 border rounded">
            <div className="font-semibold">
              {c.firstName} {c.lastName}
            </div>
            <div className="text-sm">{c.email}</div>
            {c.phone && <div className="text-sm">{c.phone}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
