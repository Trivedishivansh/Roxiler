import { useState } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

const DataTable = ({ 
  columns, 
  data, 
  onSort, 
  sortConfig, 
  filters, 
  onFilterChange,
  actions 
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSort = (key) => {
    if (onSort) {
      const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
      onSort(key, direction)
    }
  }

  const renderSortIcon = (key) => {
    if (sortConfig?.key !== key) return null
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filters */}
      {filters && (
        <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <input
                type="text"
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable