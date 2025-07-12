import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOpportunity } from '../../hooks/useOpportunities';
import { useActivities } from '../../hooks/useActivities';
import DataTable from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import ActivityModal from '../../components/ActivityModal';
import type { Activity } from '../../hooks/useActivities';
import type { CreateActivityDto } from '../../hooks/useActivities';
import { useCreateActivity } from '../../hooks/useActivities';
import { ACTIVITY_TYPES } from '../../hooks/useActivities';

const OPPORTUNITY_STATUS_COLORS = {
  'prospecting': 'bg-gray-100 text-gray-800',
  'qualification': 'bg-blue-100 text-blue-800',
  'proposal': 'bg-yellow-100 text-yellow-800',
  'negotiation': 'bg-orange-100 text-orange-800',
  'closed-won': 'bg-green-100 text-green-800',
  'closed-lost': 'bg-red-100 text-red-800',
};

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opportunityId = parseInt(id || '0', 10);

  const getActivityTypeConfig = (type: string) => {
    return ACTIVITY_TYPES.find(t => t.value === type) || 
           { value: type, label: type, icon: '📋', color: 'bg-gray-100 text-gray-800' };
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'activities'>('overview');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Data fetching
  const { data: opportunity, isLoading: opportunityLoading, error: opportunityError } = useOpportunity(opportunityId);
  
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({
    page: 1,
    limit: 50,
    search: '',
    type: '',
    opportunityId,
    sortBy: 'occurredAt',
    sortOrder: 'desc'
  });

  // Mutations
  const createActivityMutation = useCreateActivity();

  if (opportunityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (opportunityError || !opportunity) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Opportunity Not Found</h1>
          <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist or may have been deleted.</p>
          <Link
            to="/opportunities"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const activities = activitiesData?.data || [];

  const handleCreateActivity = async (data: CreateActivityDto) => {
    try {
      await createActivityMutation.mutateAsync({
        ...data,
        opportunityId,
        companyId: opportunity.companyId,
        contactId: opportunity.contactId || undefined,
      });
      setIsActivityModalOpen(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  const activityColumns: Column<Activity>[] = [
    {
      key: 'type',
      title: 'Activity',
      sortable: true,
      render: (value) => {
        const typeConfig = getActivityTypeConfig(value);
        return (
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${typeConfig.color}`}>
            <span className="mr-1">{typeConfig.icon}</span>
            {typeConfig.label}
          </span>
        );
      },
    },
    {
      key: 'details',
      title: 'Details',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={value}>
            {value || 'No details provided'}
          </p>
        </div>
      ),
    },
    {
      key: 'occurredAt',
      title: 'Date & Time',
      sortable: true,
      render: (value) => {
        const date = new Date(value);
        return (
          <div className="text-sm text-gray-900">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      title: 'Logged',
      sortable: true,
      render: (value) => {
        const date = new Date(value);
        return <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>;
      },
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'activities', name: 'Activities', count: activities.length },
  ] as const;

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/opportunities" className="text-blue-600 hover:underline">
          Opportunities
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{opportunity.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${OPPORTUNITY_STATUS_COLORS[opportunity.status as keyof typeof OPPORTUNITY_STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                {opportunity.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="text-lg font-semibold text-green-600">
                ${opportunity.amount?.toLocaleString() || '0'}
              </span>
              {opportunity.closeDate && (
                <span>
                  Expected Close: {new Date(opportunity.closeDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/opportunities')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Opportunities
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Opportunity Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Opportunity Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Value</label>
                <p className="mt-1 text-sm text-gray-900 font-semibold text-green-600">
                  ${opportunity.amount?.toLocaleString() || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${OPPORTUNITY_STATUS_COLORS[opportunity.status as keyof typeof OPPORTUNITY_STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                    {opportunity.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Close Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {opportunity.closeDate ? new Date(opportunity.closeDate).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Related Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company</h3>
              {opportunity.company && (
                <div className="space-y-2">
                  <Link
                    to={`/companies/${opportunity.company.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {opportunity.company.name}
                  </Link>
                  {opportunity.company.industry && (
                    <p className="text-sm text-gray-600">{opportunity.company.industry}</p>
                  )}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Contact</h3>
              {opportunity.contact ? (
                <div className="space-y-2">
                  <Link
                    to={`/contacts/${opportunity.contact.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {opportunity.contact.firstName} {opportunity.contact.lastName}
                  </Link>
                  {opportunity.contact.email && (
                    <p className="text-sm text-gray-600">{opportunity.contact.email}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No primary contact assigned</p>
              )}
            </div>
          </div>

          {/* Recent Activities Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
              <button
                onClick={() => setActiveTab('activities')}
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 3).map((activity) => {
                  const typeConfig = getActivityTypeConfig(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${typeConfig.color}`}>
                        <span className="mr-1">{typeConfig.icon}</span>
                        {typeConfig.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          {activity.details || 'No details provided'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.occurredAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No activities logged yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Activities</h2>
            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Log Activity
            </button>
          </div>

          <div className="bg-white shadow rounded-lg">
            <DataTable
              data={activities}
              columns={activityColumns}
              loading={activitiesLoading}
              pagination={{ page: 1, limit: 50, total: activities.length, totalPages: 1 }}
              onPageChange={() => {}}
              emptyText="No activities found"
            />
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {isActivityModalOpen && (
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          onSubmit={handleCreateActivity}
          isLoading={createActivityMutation.isPending}
        />
      )}
    </div>
  );
}