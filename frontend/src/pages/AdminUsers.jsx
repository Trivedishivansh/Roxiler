import { useEffect, useState } from 'react'
import api from '../services/api'
import DataTable from '../components/DataTable'
import toast from 'react-hot-toast'
import { Plus, Eye } from 'lucide-react'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'Normal User'
  })

  useEffect(() => {
    fetchUsers()
  }, [sortConfig, filters])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        ...filters
      })
      const response = await api.get(`/admin/users?${params}`)
      setUsers(response.data.users)
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction })
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/users', formData)
      toast.success('User created successfully')
      setShowModal(false)
      setFormData({ name: '', email: '', password: '', address: '', role: 'Normal User' })
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    }
  }

  const viewUserDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`)
      setSelectedUser(response.data)
    } catch (error) {
      toast.error('Failed to fetch user details')
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ]

  const filterConfig = [
    { key: 'name', placeholder: 'Filter by Name', value: filters.name },
    { key: 'email', placeholder: 'Filter by Email', value: filters.email },
    { key: 'address', placeholder: 'Filter by Address', value: filters.address },
    { key: 'role', placeholder: 'Filter by Role', value: filters.role },
  ]

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        onSort={handleSort}
        sortConfig={sortConfig}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        actions={(row) => (
          <button
            onClick={() => viewUserDetails(row.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18} />
          </button>
        )}
      />

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name (20-60 chars)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                  minLength={20}
                  maxLength={60}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password (8-16, 1 uppercase, 1 special)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address (Optional)</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  maxLength={400}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                >
                  <option value="Normal User">Normal User</option>
                  <option value="Store Owner">Store Owner</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
              <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
              <p><span className="font-medium">Address:</span> {selectedUser.address || 'N/A'}</p>
              <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
              {selectedUser.stores && (
                <div>
                  <p className="font-medium">Stores:</p>
                  {selectedUser.stores.map(store => (
                    <div key={store.id} className="ml-4 mt-2 p-2 bg-gray-50 rounded">
                      <p>{store.name} - Rating: {store.rating}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setSelectedUser(null)} className="btn-primary w-full mt-6">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers