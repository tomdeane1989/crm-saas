import React, { useState } from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  selectedRows?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
  rowKey?: keyof T;
  actions?: React.ReactNode;
  emptyText?: string;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  selectedRows = [],
  onSelectionChange,
  rowKey = 'id' as keyof T,
  actions,
  emptyText = 'No data available',
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    onSort?.(field, newOrder);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map(item => item[rowKey] as number));
    }
  };

  const handleSelectRow = (id: number) => {
    const newSelection = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    onSelectionChange?.(newSelection);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const renderPagination = () => {
    if (!pagination || !onPageChange) return null;

    const { page, totalPages } = pagination;
    const pages: number[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>
            Showing {((page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {pages.map((pageNum, index) => (
            <React.Fragment key={pageNum}>
              {index > 0 && pages[index - 1] < pageNum - 1 && (
                <span className="px-2 text-gray-400">...</span>
              )}
              <button
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded ${
                  page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            </React.Fragment>
          ))}
          
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header with actions */}
      {(actions || selectedRows.length > 0) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {selectedRows.length > 0 && (
              <span className="text-sm text-gray-700">
                {selectedRows.length} item(s) selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="text-gray-400">{getSortIcon(String(column.key))}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr
                  key={record[rowKey] as React.Key}
                  className={`hover:bg-gray-50 ${
                    selectedRows.includes(record[rowKey] as number) ? 'bg-blue-50' : ''
                  }`}
                >
                  {onSelectionChange && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(record[rowKey] as number)}
                        onChange={() => handleSelectRow(record[rowKey] as number)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(record[column.key as keyof T], record)
                        : String(record[column.key as keyof T] || '')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}