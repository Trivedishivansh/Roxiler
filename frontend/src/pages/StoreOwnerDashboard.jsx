import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import StarRating from '../components/StarRating'
import { Store, Users, Star, TrendingUp } from 'lucide-react'

const StoreOwnerDashboard = () => {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/auth/dashboard')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Store Dashboard</h1>

      {data?.stores?.map((store) => (
        <div key={store.storeId} className="space-y-6">
          {/* Store Header */}
          <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{store.storeName}</h2>
                <p className="text-gray-600 mt-1">{store.email}</p>
                <p className="text-gray-500 text-sm">{store.address}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="flex items-center space-x-2 justify-end">
                  <Star className="text-yellow-400 fill-yellow-400" size={32} />
                  <span className="text-4xl font-bold text-gray-900">{store.averageRating}</span>
                </div>
                <p className="text-gray-600 mt-1">Average Rating</p>
                <p className="text-sm text-gray-500">{store.totalRatings} total ratings</p>
              </div>
            </div>
          </div>

          {/* Ratings List */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Users size={24} />
              <span>Customer Ratings</span>
            </h3>

            {store.ratedBy.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No ratings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {store.ratedBy.map((rating, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{rating.userName}</div>
                          <div className="text-sm text-gray-500">{rating.userAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {rating.userEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StarRating rating={rating.rating} size={16} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(rating.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StoreOwnerDashboard