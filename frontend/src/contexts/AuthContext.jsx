import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      toast.success('Login successful!')
      
      // Redirect based on role
      if (user.role === 'System Administrator') {
        navigate('/dashboard')
      } else if (user.role === 'Normal User') {
        navigate('/stores')
      } else if (user.role === 'Store Owner') {
        navigate('/owner/dashboard')
      }
      
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      toast.success('Registration successful!')
      navigate('/stores')
      
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword })
      toast.success('Password updated successfully')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
      return { success: false }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updatePassword,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}