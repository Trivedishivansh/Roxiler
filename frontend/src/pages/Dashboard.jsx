import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Users, Store, Star, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (user.role === 'System Administrator') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-900">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="card bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Stores</p>
                <p className="text-3xl font-bold text-green-900">{stats?.totalStores || 0}</p>
              </div>
              <Store className="text-green-500" size={40} />
            </div>
          </div>

          <div className="card bg-yellow-50 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Total Ratings</p>
                <p className="text-3xl font-bold text-yellow-900">{stats?.totalRatings || 0}</p>
              </div>
              <Star className="text-yellow-500" size={40} />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <a href="/admin/users" className="btn-primary">Manage Users</a>
            <a href="/admin/stores" className="btn-primary">Manage Stores</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h1>
      <p className="text-gray-600">Role: {user.role}</p>
    </div>
  )
}

export default Dashboard