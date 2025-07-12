import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../hooks/useCompanies';
import { useContacts } from '../../hooks/useContacts';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useActivities } from '../../hooks/useActivities';
import DataTable from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import ContactModal from '../../components/ContactModal';
import OpportunityModal from '../../components/OpportunityModal';
import ActivityModal from '../../components/ActivityModal';
import type { Contact } from '../../hooks/useContacts';
import type { Opportunity } from '../../hooks/useOpportunities';
import type { Activity } from '../../hooks/useActivities';
import type { CreateContactDto } from '../../hooks/useContacts';
import type { CreateOpportunityDto } from '../../hooks/useOpportunities';
import type { CreateActivityDto } from '../../hooks/useActivities';
import { useCreateContact } from '../../hooks/useContacts';
import { useCreateOpportunity } from '../../hooks/useOpportunities';
import { useCreateActivity } from '../../hooks/useActivities';

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = parseInt(id || '0', 10);

  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'opportunities' | 'activities'>('overview');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Data fetching
  const { data: company, isLoading: companyLoading, error: companyError } = useCompany(companyId);
  
  const { data: contactsData, isLoading: contactsLoading } = useContacts({
    page: 1,
    limit: 50,
    search: '',
    role: '',
    companyId,
    sortBy: 'firstName',
    sortOrder: 'asc'
  });

  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useOpportunities({
    page: 1,
    limit: 50,
    search: '',
    status: '',
    companyId,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({
    page: 1,
    limit: 50,
    search: '',
    type: '',
    companyId,
    sortBy: 'occurredAt',
    sortOrder: 'desc'
  });

  // Mutations
  const createContactMutation = useCreateContact();
  const createOpportunityMutation = useCreateOpportunity();
  const createActivityMutation = useCreateActivity();

  const contacts = contactsData?.data || [];
  const opportunities = opportunitiesData?.data || [];
  const activities = activitiesData?.data || [];

  // Contact columns
  const contactColumns: Column<Contact>[] = [
    {
      key: 'firstName',
      title: 'Name',
      sortable: true,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.firstName} {record.lastName}
          </div>
          {record.role && (
            <div className="text-sm text-gray-600">{record.role}</div>
          )}
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value) => value || '—',
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '100px',
      render: (_, record) => (
        <Link
          to={`/contacts/${record.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View Details
        </Link>
      ),
    },
  ];

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
      key: 'contact',
      title: 'Contact',
      render: (_, record) => (
        record.contact ? (
          <div className="text-sm text-gray-900">
            {record.contact.firstName} {record.contact.lastName}
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

  const handleCreateContact = (data: CreateContactDto) => {
    createContactMutation.mutate(
      { ...data, companyId },
      {
        onSuccess: () => {
          setIsContactModalOpen(false);
        }
      }
    );
  };

  const handleCreateOpportunity = (data: CreateOpportunityDto) => {
    createOpportunityMutation.mutate(
      { ...data, companyId },
      {
        onSuccess: () => {
          setIsOpportunityModalOpen(false);
        }
      }
    );
  };

  const handleCreateActivity = (data: CreateActivityDto) => {
    createActivityMutation.mutate(
      { ...data, companyId },
      {
        onSuccess: () => {
          setIsActivityModalOpen(false);
        }
      }
    );
  };

  if (companyLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {companyError?.message || 'Company not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/companies" className="text-blue-600 hover:underline">
          Companies
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{company.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              {company.industry && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {company.industry}
                </span>
              )}
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span>Created {new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/companies`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Companies
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'contacts', label: `Contacts (${contacts.length})` },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
            <div className="text-sm text-gray-600">Contacts</div>
          </div>
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

      {activeTab === 'contacts' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Contact
            </button>
          </div>
          <DataTable
            data={contacts}
            columns={contactColumns}
            loading={contactsLoading}
            emptyText="No contacts found for this company."
          />
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
            emptyText="No opportunities found for this company."
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
            emptyText="No activities found for this company."
          />
        </div>
      )}

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleCreateContact}
        isLoading={createContactMutation.isPending}
        prefilledCompanyId={companyId}
      />

      <OpportunityModal
        isOpen={isOpportunityModalOpen}
        onClose={() => setIsOpportunityModalOpen(false)}
        onSubmit={handleCreateOpportunity}
        isLoading={createOpportunityMutation.isPending}
        prefilledCompanyId={companyId}
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