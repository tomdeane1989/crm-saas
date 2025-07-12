import { useState } from "react";
import { 
  useActivities, 
  useCreateActivity, 
  useUpdateActivity, 
  useDeleteActivity, 
  useBulkDeleteActivities,
  ACTIVITY_TYPES,
} from "../../hooks/useActivities";
import type {
  Activity,
  ActivityFilters,
  CreateActivityDto
} from "../../hooks/useActivities";
import DataTable from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import ActivityModal from "../../components/ActivityModal";

export default function ActivitiesPage() {
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 1,
    limit: 20,
    search: '',
    type: '',
    sortBy: 'occurredAt',
    sortOrder: 'desc',
  });
  
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const { data: activitiesData, isLoading, error } = useActivities(filters);
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();
  const deleteMutation = useDeleteActivity();
  const bulkDeleteMutation = useBulkDeleteActivities();

  const activities = activitiesData?.data || [];
  const pagination = activitiesData?.pagination;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: order, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ ...prev, type, page: 1 }));
  };

  const handleCreateActivity = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = (id: number) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} activities?`)) {
      bulkDeleteMutation.mutate(selectedRows, {
        onSuccess: () => setSelectedRows([])
      });
    }
  };

  const handleModalSubmit = (data: CreateActivityDto) => {
    if (editingActivity) {
      updateMutation.mutate(
        { id: editingActivity.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingActivity(null);
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

  const getActivityTypeConfig = (type: string) => {
    return ACTIVITY_TYPES.find(t => t.value === type) || 
           { value: type, label: type, icon: '📋', color: 'bg-gray-100 text-gray-800' };
  };

  const columns: Column<Activity>[] = [
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
            {value || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'company',
      title: 'Company',
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.company?.name}
          </div>
          {record.company?.industry && (
            <div className="text-sm text-gray-600">{record.company.industry}</div>
          )}
        </div>
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
            <span className="text-sm text-gray-500">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'opportunity',
      title: 'Opportunity',
      render: (_, record) => (
        <div>
          {record.opportunity ? (
            <>
              <div className="text-sm text-gray-900">{record.opportunity.title}</div>
              <div className="text-sm text-gray-600">{record.opportunity.status}</div>
            </>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'occurredAt',
      title: 'Date',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditActivity(record)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteActivity(record.id)}
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
        onClick={handleCreateActivity}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Log Activity
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
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track all interactions and tasks across your CRM
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search activity details..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={filters.type}
            onChange={(e) => handleTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Activity Types</option>
            {ACTIVITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={activities}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        actions={actions}
        emptyText="No activities found. Log your first activity to get started."
      />

      {/* Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSubmit={handleModalSubmit}
        activity={editingActivity}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}