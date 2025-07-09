import AskDashboard from '../components/AskDashboard';
import { useDashboardStats } from "../../hooks/useDashboardStats";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardStats();

  if (isLoading) return <div>Loading dashboard…</div>;
  if (isError) return <div>Error: {String(error)}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <ul className="space-y-2">
        <li>Total Companies: {data!.totalCompanies}</li>
        <li>Total Contacts: {data!.totalContacts}</li>
        <li>Total Opportunities: {data!.totalOpportunities}</li>
        <li>Total Activities: {data!.totalActivities}</li>
      </ul>
    </div>
  );
}
