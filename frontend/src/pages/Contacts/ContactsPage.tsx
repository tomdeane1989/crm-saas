import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useContacts, 
  useCreateContact, 
  useUpdateContact, 
  useDeleteContact, 
  useBulkDeleteContacts,
} from "../../hooks/useContacts";
import type {
  Contact,
  ContactFilters,
  CreateContactDto
} from "../../hooks/useContacts";
import DataTable from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import ContactModal from "../../components/ContactModal";

export default function ContactsPage() {
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 20,
    search: '',
    role: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { data: contactsData, isLoading, error } = useContacts(filters);
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();
  const bulkDeleteMutation = useBulkDeleteContacts();

  const contacts = contactsData?.data || [];
  const pagination = contactsData?.pagination;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: order, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters(prev => ({ ...prev, role, page: 1 }));
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} contacts?`)) {
      bulkDeleteMutation.mutate(selectedRows, {
        onSuccess: () => setSelectedRows([])
      });
    }
  };

  const handleModalSubmit = (data: CreateContactDto) => {
    if (editingContact) {
      updateMutation.mutate(
        { id: editingContact.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingContact(null);
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

  const columns: Column<Contact>[] = [
    {
      key: 'firstName',
      title: 'Name',
      sortable: true,
      render: (_, record) => (
        <div>
          <Link 
            to={`/contacts/${record.id}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {record.firstName} {record.lastName}
          </Link>
          {record.email && (
            <div className="text-sm text-gray-600">{record.email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'company',
      title: 'Company',
      render: (_, record) => (
        <div>
          {record.company ? (
            <Link 
              to={`/companies/${record.company.id}`}
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              {record.company.name}
            </Link>
          ) : (
            <span className="font-medium text-gray-900">No company</span>
          )}
          {record.company?.industry && (
            <div className="text-sm text-gray-600">{record.company.industry}</div>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          {value || 'Not specified'}
        </span>
      ),
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || '—'}
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
            to={`/contacts/${record.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View
          </Link>
          <button
            onClick={() => handleEditContact(record)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteContact(record.id)}
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
        onClick={handleCreateContact}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Add Contact
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
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your contact database and relationships
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search contacts..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Filter by role..."
            value={filters.role}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={contacts}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        actions={actions}
        emptyText="No contacts found. Create your first contact to get started."
      />

      {/* Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleModalSubmit}
        contact={editingContact}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}