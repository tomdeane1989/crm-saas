import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContact } from '../../hooks/useContacts';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useActivities } from '../../hooks/useActivities';
import DataTable from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import OpportunityModal from '../../components/OpportunityModal';
import ActivityModal from '../../components/ActivityModal';
import type { Opportunity } from '../../hooks/useOpportunities';
import type { Activity } from '../../hooks/useActivities';
import type { CreateOpportunityDto } from '../../hooks/useOpportunities';
import type { CreateActivityDto } from '../../hooks/useActivities';
import { useCreateOpportunity } from '../../hooks/useOpportunities';
import { useCreateActivity } from '../../hooks/useActivities';

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contactId = parseInt(id || '0', 10);

  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'activities'>('overview');
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Data fetching
  const { data: contact, isLoading: contactLoading, error: contactError } = useContact(contactId);
  
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useOpportunities({
    page: 1,
    limit: 50,
    search: '',
    status: '',
    contactId,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({
    page: 1,
    limit: 50,
    search: '',
    type: '',
    contactId,
    sortBy: 'occurredAt',
    sortOrder: 'desc'
  });

  // Mutations
  const createOpportunityMutation = useCreateOpportunity();
  const createActivityMutation = useCreateActivity();

  const opportunities = opportunitiesData?.data || [];
  const activities = activitiesData?.data || [];

  // Opportunity columns
  const opportunityColumns: Column<Opportunity>[] = [
    {
      key: 'title',
      title: 'Opportunity',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {record.amount && (
            <div className="text-sm text-gray-600">
              ${record.amount.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'won' ? 'bg-green-100 text-green-800' :
          value === 'lost' ? 'bg-red-100 text-red-800' :
          value === 'proposal' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'expectedCloseDate',
      title: 'Close Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '100px',
      render: (_, record) => (
        <Link
          to={`/opportunities/${record.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View Details
        </Link>
      ),
    },
  ];

  // Activity columns
  const activityColumns: Column<Activity>[] = [
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <span className="text-sm capitalize">{value}</span>
      ),
    },
    {
      key: 'details',
      title: 'Details',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={value}>
            {value || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'opportunity',
      title: 'Related Opportunity',
      render: (_, record) => (
        record.opportunity ? (
          <div className="text-sm text-gray-900">
            {record.opportunity.title}
          </div>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        )
      ),
    },
    {
      key: 'occurredAt',
      title: 'Date',
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const handleCreateOpportunity = (data: CreateOpportunityDto) => {
    if (!contact) return;
    
    createOpportunityMutation.mutate(
      { ...data, companyId: contact.companyId, contactId },
      {
        onSuccess: () => {
          setIsOpportunityModalOpen(false);
        }
      }
    );
  };

  const handleCreateActivity = (data: CreateActivityDto) => {
    if (!contact) return;
    
    createActivityMutation.mutate(
      { ...data, companyId: contact.companyId, contactId },
      {
        onSuccess: () => {
          setIsActivityModalOpen(false);
        }
      }
    );
  };

  if (contactLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (contactError || !contact) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {contactError?.message || 'Contact not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/contacts" className="text-blue-600 hover:underline">
          Contacts
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{contact.firstName} {contact.lastName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              {contact.role && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {contact.role}
                </span>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                  {contact.phone}
                </a>
              )}
            </div>
            {contact.company && (
              <div className="mt-2">
                <Link 
                  to={`/companies/${contact.company.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {contact.company.name}
                  {contact.company.industry && ` (${contact.company.industry})`}
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(`/contacts`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Contacts
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'opportunities', label: `Opportunities (${opportunities.length})` },
              { key: 'activities', label: `Activities (${activities.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{opportunities.length}</div>
            <div className="text-sm text-gray-600">Opportunities</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{activities.length}</div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              ${opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Pipeline Value</div>
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsOpportunityModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Opportunity
            </button>
          </div>
          <DataTable
            data={opportunities}
            columns={opportunityColumns}
            loading={opportunitiesLoading}
            emptyText="No opportunities found for this contact."
          />
        </div>
      )}

      {activeTab === 'activities' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Log Activity
            </button>
          </div>
          <DataTable
            data={activities}
            columns={activityColumns}
            loading={activitiesLoading}
            emptyText="No activities found for this contact."
          />
        </div>
      )}

      {/* Modals */}
      <OpportunityModal
        isOpen={isOpportunityModalOpen}
        onClose={() => setIsOpportunityModalOpen(false)}
        onSubmit={handleCreateOpportunity}
        isLoading={createOpportunityMutation.isPending}
        prefilledCompanyId={contact.companyId}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleCreateActivity}
        isLoading={createActivityMutation.isPending}
      />
    </div>
  );
}