import { useState } from "react";
import { 
  useOpportunities, 
  useCreateOpportunity, 
  useUpdateOpportunity, 
  useDeleteOpportunity, 
  useBulkDeleteOpportunities,
  OPPORTUNITY_STATUSES,
} from "../../hooks/useOpportunities";
import type {
  Opportunity,
  OpportunityFilters,
  CreateOpportunityDto
} from "../../hooks/useOpportunities";
import DataTable from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import OpportunityModal from "../../components/OpportunityModal";

export default function OpportunitiesPage() {
  const [filters, setFilters] = useState<OpportunityFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const { data: opportunitiesData, isLoading, error } = useOpportunities(filters);
  const createMutation = useCreateOpportunity();
  const updateMutation = useUpdateOpportunity();
  const deleteMutation = useDeleteOpportunity();
  const bulkDeleteMutation = useBulkDeleteOpportunities();

  const opportunities = opportunitiesData?.data || [];
  const pagination = opportunitiesData?.pagination;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: order, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleCreateOpportunity = () => {
    setEditingOpportunity(null);
    setIsModalOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleDeleteOpportunity = (id: number) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} opportunities?`)) {
      bulkDeleteMutation.mutate(selectedRows, {
        onSuccess: () => setSelectedRows([])
      });
    }
  };

  const handleModalSubmit = (data: CreateOpportunityDto) => {
    if (editingOpportunity) {
      updateMutation.mutate(
        { id: editingOpportunity.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingOpportunity(null);
          }
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        }
      });
    }
  };

  const getStatusConfig = (status: string) => {
    return OPPORTUNITY_STATUSES.find(s => s.value === status) || 
           { value: status, label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns: Column<Opportunity>[] = [
    {
      key: 'title',
      title: 'Opportunity',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {record.company && (
            <div className="text-sm text-gray-600">{record.company.name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = getStatusConfig(value);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        );
      },
    },
    {
      key: 'amount',
      title: 'Value',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (_, record) => (
        <div>
          {record.contact ? (
            <>
              <div className="text-sm text-gray-900">
                {record.contact.firstName} {record.contact.lastName}
              </div>
              {record.contact.email && (
                <div className="text-sm text-gray-600">{record.contact.email}</div>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">No contact assigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'closeDate',
      title: 'Close Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: '_count',
      title: 'Activities',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.activities || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditOpportunity(record)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteOpportunity(record.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const actions = (
    <div className="flex space-x-2">
      {selectedRows.length > 0 && (
        <button
          onClick={handleBulkDelete}
          disabled={bulkDeleteMutation.isPending}
          className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {bulkDeleteMutation.isPending ? 'Deleting...' : `Delete (${selectedRows.length})`}
        </button>
      )}
      <button
        onClick={handleCreateOpportunity}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Add Opportunity
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your sales pipeline and opportunities
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {OPPORTUNITY_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={opportunities}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        actions={actions}
        emptyText="No opportunities found. Create your first opportunity to get started."
      />

      {/* Modal */}
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpportunity(null);
        }}
        onSubmit={handleModalSubmit}
        opportunity={editingOpportunity}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
