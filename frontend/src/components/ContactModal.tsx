import { useState, useEffect } from 'react';
import type { Contact, CreateContactDto } from '../hooks/useContacts';
import { useCompanies } from '../hooks/useCompanies';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContactDto) => void;
  contact?: Contact | null;
  isLoading?: boolean;
  title?: string;
  prefilledCompanyId?: number;
}

export default function ContactModal({
  isOpen,
  onClose,
  onSubmit,
  contact,
  isLoading = false,
  title,
  prefilledCompanyId,
}: ContactModalProps) {
  const [formData, setFormData] = useState<CreateContactDto>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    externalId: '',
    customFields: {},
    companyId: 0,
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

  const companies = companiesData?.data || [];

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email || '',
        phone: contact.phone || '',
        role: contact.role || '',
        externalId: contact.externalId || '',
        customFields: contact.customFields || {},
        companyId: contact.companyId,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        externalId: '',
        customFields: {},
        companyId: prefilledCompanyId || 0,
      });
    }
    setErrors({});
  }, [contact, isOpen, prefilledCompanyId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.companyId || formData.companyId === 0) {
      newErrors.companyId = 'Company is required';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      role: formData.role || undefined,
      externalId: formData.externalId || undefined,
    };

    onSubmit(submissionData);
  };

  const handleInputChange = (field: keyof CreateContactDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
                {title || (contact ? 'Edit Contact' : 'Create Contact')}
              </h3>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
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

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone and Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Sales Manager"
                  />
                </div>
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
                {isLoading ? 'Saving...' : (contact ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}