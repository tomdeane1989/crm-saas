// frontend/src/pages/Companies/CompaniesPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useCompanies, 
  useCreateCompany, 
  useUpdateCompany, 
  useDeleteCompany, 
  useBulkDeleteCompanies,
} from "../../hooks/useCompanies";
import type {
  Company,
  CompanyFilters,
  CreateCompanyDto
} from "../../hooks/useCompanies";
import DataTable from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import CompanyModal from "../../components/CompanyModal";

export default function CompaniesPage() {
  const [filters, setFilters] = useState<CompanyFilters>({
    page: 1,
    limit: 20,
    search: '',
    industry: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const { data: companiesData, isLoading, error } = useCompanies(filters);
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();
  const bulkDeleteMutation = useBulkDeleteCompanies();

  const companies = companiesData?.data || [];
  const pagination = companiesData?.pagination;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: order, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleIndustryFilter = (industry: string) => {
    setFilters(prev => ({ ...prev, industry, page: 1 }));
  };

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (id: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} companies?`)) {
      bulkDeleteMutation.mutate(selectedRows, {
        onSuccess: () => setSelectedRows([])
      });
    }
  };

  const handleModalSubmit = (data: CreateCompanyDto) => {
    if (editingCompany) {
      updateMutation.mutate(
        { id: editingCompany.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingCompany(null);
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

  const columns: Column<Company>[] = [
    {
      key: 'name',
      title: 'Company Name',
      sortable: true,
      render: (value, record) => (
        <div>
          <Link 
            to={`/companies/${record.id}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {value}
          </Link>
          {record.website && (
            <div>
              <a 
                href={record.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {record.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'industry',
      title: 'Industry',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          {value || 'Not specified'}
        </span>
      ),
    },
    {
      key: '_count',
      title: 'Contacts',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.contacts || 0}
        </span>
      ),
    },
    {
      key: '_count',
      title: 'Opportunities',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.opportunities || 0}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Link
            to={`/companies/${record.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View
          </Link>
          <button
            onClick={() => handleEditCompany(record)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCompany(record.id)}
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
        onClick={handleCreateCompany}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Add Company
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
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your company database and relationships
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={filters.industry}
            onChange={(e) => handleIndustryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={companies}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        actions={actions}
        emptyText="No companies found. Create your first company to get started."
      />

      {/* Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleModalSubmit}
        company={editingCompany}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}