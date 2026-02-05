import { useEffect, useState } from 'react'
import api from '../services/api'
import DataTable from '../components/DataTable'
import toast from 'react-hot-toast'
import { Plus, Star } from 'lucide-react'

const AdminStores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [showModal, setShowModal] = useState(false)
  const [owners, setOwners] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  })

  useEffect(() => {
    fetchStores()
    fetchOwners()
  }, [sortConfig, filters])

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        ...filters
      })
      const response = await api.get(`/admin/stores?${params}`)
      setStores(response.data.stores)
    } catch (error) {
      toast.error('Failed to fetch stores')
    } finally {
      setLoading(false)
    }
  }

  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/users?role=Store Owner')
      setOwners(response.data.users)
    } catch (error) {
      console.error('Failed to fetch owners')
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
      await api.post('/admin/stores', formData)
      toast.success('Store created successfully')
      setShowModal(false)
      setFormData({ name: '', email: '', address: '', ownerId: '' })
      fetchStores()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create store')
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: true,
      render: (rating) => (
        <div className="flex items-center space-x-1">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span>{rating}</span>
        </div>
      )
    },
    { key: 'totalRatings', label: 'Total Ratings', sortable: true },
  ]

  const filterConfig = [
    { key: 'name', placeholder: 'Filter by Name', value: filters.name },
    { key: 'email', placeholder: 'Filter by Email', value: filters.email },
    { key: 'address', placeholder: 'Filter by Address', value: filters.address },
  ]

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Store</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={stores}
        onSort={handleSort}
        sortConfig={sortConfig}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
      />

      {/* Create Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Store</h2>
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
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  maxLength={400}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <select
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                  ))}
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
    </div>
  )
}

export default AdminStores