import { useState, useEffect } from 'react';
import type { Activity, CreateActivityDto } from '../hooks/useActivities';
import { ACTIVITY_TYPES } from '../hooks/useActivities';
import { useCompanies } from '../hooks/useCompanies';
import { useContacts } from '../hooks/useContacts';
import { useOpportunities } from '../hooks/useOpportunities';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityDto) => void;
  activity?: Activity | null;
  isLoading?: boolean;
  title?: string;
}

export default function ActivityModal({
  isOpen,
  onClose,
  onSubmit,
  activity,
  isLoading = false,
  title,
}: ActivityModalProps) {
  const [formData, setFormData] = useState<CreateActivityDto>({
    type: 'call',
    details: '',
    occurredAt: '',
    customFields: {},
    companyId: 0,
    contactId: undefined,
    opportunityId: undefined,
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

  // Fetch opportunities for dropdown (filtered by selected company if any)
  const { data: opportunitiesData } = useOpportunities({
    page: 1,
    limit: 100,
    search: '',
    status: '',
    companyId: formData.companyId || undefined,
    sortBy: 'title',
    sortOrder: 'asc',
  });

  const companies = companiesData?.data || [];
  const contacts = contactsData?.data || [];
  const opportunities = opportunitiesData?.data || [];

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type,
        details: activity.details || '',
        occurredAt: activity.occurredAt ? activity.occurredAt.split('T')[0] : '',
        customFields: activity.customFields || {},
        companyId: activity.companyId,
        contactId: activity.contactId,
        opportunityId: activity.opportunityId,
      });
    } else {
      setFormData({
        type: 'call',
        details: '',
        occurredAt: new Date().toISOString().split('T')[0], // Default to today
        customFields: {},
        companyId: 0,
        contactId: undefined,
        opportunityId: undefined,
      });
    }
    setErrors({});
  }, [activity, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Activity type is required';
    }

    if (!formData.companyId || formData.companyId === 0) {
      newErrors.companyId = 'Company is required';
    }

    if (!formData.details?.trim()) {
      newErrors.details = 'Activity details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      details: formData.details || undefined,
      occurredAt: formData.occurredAt || undefined,
      contactId: formData.contactId || undefined,
      opportunityId: formData.opportunityId || undefined,
    };

    onSubmit(submissionData);
  };

  const handleInputChange = (field: keyof CreateActivityDto, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset contact and opportunity when company changes
    if (field === 'companyId') {
      setFormData(prev => ({ ...prev, contactId: undefined, opportunityId: undefined }));
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
                {title || (activity ? 'Edit Activity' : 'Log Activity')}
              </h3>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Activity Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
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

              {/* Contact and Opportunity */}
              <div className="grid grid-cols-2 gap-4">
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
                    <option value="">Select contact (optional)</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="opportunityId" className="block text-sm font-medium text-gray-700 mb-1">
                    Opportunity
                  </label>
                  <select
                    id="opportunityId"
                    value={formData.opportunityId || ''}
                    onChange={(e) => handleInputChange('opportunityId', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.companyId}
                  >
                    <option value="">Select opportunity (optional)</option>
                    {opportunities.map((opportunity) => (
                      <option key={opportunity.id} value={opportunity.id}>
                        {opportunity.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  id="occurredAt"
                  type="date"
                  value={formData.occurredAt}
                  onChange={(e) => handleInputChange('occurredAt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Details *
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.details ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe what happened during this activity..."
                />
                {errors.details && (
                  <p className="mt-1 text-sm text-red-600">{errors.details}</p>
                )}
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
                {isLoading ? 'Saving...' : (activity ? 'Update' : 'Log Activity')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}