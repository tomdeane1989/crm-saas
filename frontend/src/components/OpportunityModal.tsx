import { useState, useEffect } from 'react';
import type { Opportunity, CreateOpportunityDto } from '../hooks/useOpportunities';
import { OPPORTUNITY_STATUSES } from '../hooks/useOpportunities';
import { useCompanies } from '../hooks/useCompanies';
import { useContacts } from '../hooks/useContacts';

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOpportunityDto) => void;
  opportunity?: Opportunity | null;
  isLoading?: boolean;
  title?: string;
  prefilledCompanyId?: number;
}

export default function OpportunityModal({
  isOpen,
  onClose,
  onSubmit,
  opportunity,
  isLoading = false,
  title,
  prefilledCompanyId,
}: OpportunityModalProps) {
  const [formData, setFormData] = useState<CreateOpportunityDto>({
    title: '',
    amount: undefined,
    status: 'prospect',
    closeDate: '',
    externalId: '',
    customFields: {},
    companyId: 0,
    contactId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch companies for dropdown
  const { data: companiesData } = useCompanies({
    page: 1,
    limit: 100,
    search: '',
    industry: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Fetch contacts for dropdown (filtered by selected company if any)
  const { data: contactsData } = useContacts({
    page: 1,
    limit: 100,
    search: '',
    role: '',
    companyId: formData.companyId || undefined,
    sortBy: 'firstName',
    sortOrder: 'asc',
  });

  const companies = companiesData?.data || [];
  const contacts = contactsData?.data || [];

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title,
        amount: opportunity.amount,
        status: opportunity.status,
        closeDate: opportunity.closeDate ? opportunity.closeDate.split('T')[0] : '',
        externalId: opportunity.externalId || '',
        customFields: opportunity.customFields || {},
        companyId: opportunity.companyId,
        contactId: opportunity.contactId,
      });
    } else {
      setFormData({
        title: '',
        amount: undefined,
        status: 'prospect',
        closeDate: '',
        externalId: '',
        customFields: {},
        companyId: prefilledCompanyId || 0,
        contactId: undefined,
      });
    }
    setErrors({});
  }, [opportunity, isOpen, prefilledCompanyId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Opportunity title is required';
    }

    if (!formData.companyId || formData.companyId === 0) {
      newErrors.companyId = 'Company is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (formData.amount !== undefined && formData.amount < 0) {
      newErrors.amount = 'Amount must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      amount: formData.amount || undefined,
      closeDate: formData.closeDate || undefined,
      externalId: formData.externalId || undefined,
      contactId: formData.contactId || undefined,
    };

    onSubmit(submissionData);
  };

  const handleInputChange = (field: keyof CreateOpportunityDto, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset contact when company changes
    if (field === 'companyId') {
      setFormData(prev => ({ ...prev, contactId: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {title || (opportunity ? 'Edit Opportunity' : 'Create Opportunity')}
              </h3>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter opportunity title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <select
                  id="companyId"
                  value={formData.companyId}
                  onChange={(e) => handleInputChange('companyId', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.companyId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value={0}>Select a company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
                )}
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <select
                  id="contactId"
                  value={formData.contactId || ''}
                  onChange={(e) => handleInputChange('contactId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.companyId}
                >
                  <option value="">Select a contact (optional)</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.status ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    {OPPORTUNITY_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
              </div>

              {/* Close Date */}
              <div>
                <label htmlFor="closeDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Close Date
                </label>
                <input
                  id="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => handleInputChange('closeDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (opportunity ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}