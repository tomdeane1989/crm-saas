import React from 'react';
import AskDashboard from '../../components/AskDashboard';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export default function DashboardPage() {
  const stats = useDashboardStats();

  return (
    <div className="space-y-4">
      {/* Existing dashboard widgets */}
      {/* <DashboardStatsWidget stats={stats.data} /> */}

      {/* Your AI “Ask Dashboard” widget */}
      <AskDashboard />
    </div>
  );
}