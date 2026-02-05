import { useEffect, useState } from 'react'
import api from '../services/api'
import StarRating from '../components/StarRating'
import toast from 'react-hot-toast'
import { Search, Store } from 'lucide-react'

const UserStores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({ name: '', address: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  useEffect(() => {
    fetchStores()
  }, [searchFilters, sortConfig])

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        ...searchFilters
      })
      const response = await api.get(`/user/stores?${params}`)
      setStores(response.data.stores)
    } catch (error) {
      toast.error('Failed to fetch stores')
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (storeId, rating) => {
    try {
      const store = stores.find(s => s.id === storeId)
      if (store.userSubmittedRating) {
        // Update existing rating
        await api.put(`/user/ratings/${storeId}`, { rating })
        toast.success('Rating updated successfully')
      } else {
        // Create new rating
        await api.post('/user/ratings', { storeId, rating })
        toast.success('Rating submitted successfully')
      }
      fetchStores()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Stores</h1>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchFilters.name}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
              className="input-field pl-10"
            />
          </div>
          <div className="flex-1 relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by address..."
              value={searchFilters.address}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, address: e.target.value }))}
              className="input-field pl-10"
            />
          </div>
          <select
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split('-')
              setSortConfig({ key, direction })
            }}
            className="input-field md:w-48"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="averageRating-desc">Rating (High-Low)</option>
            <option value="averageRating-asc">Rating (Low-High)</option>
          </select>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{store.address}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Rating:</span>
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(store.overallRating)} />
                  <span className="font-semibold">({store.overallRating})</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Ratings:</span>
                <span className="font-semibold">{store.totalRatings}</span>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {store.userSubmittedRating ? 'Your Rating:' : 'Rate this store:'}
                </p>
                <StarRating
                  rating={store.userSubmittedRating || 0}
                  interactive={true}
                  onRate={(rating) => handleRating(store.id, rating)}
                  size={28}
                />
                {store.userSubmittedRating && (
                  <p className="text-xs text-green-600 mt-2">Click stars to update your rating</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No stores found matching your criteria.
        </div>
      )}
    </div>
  )
}

export default UserStores