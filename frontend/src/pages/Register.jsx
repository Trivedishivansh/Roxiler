import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const { register } = useAuth()

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Name is required'
    else if (formData.name.length < 20) newErrors.name = 'Name must be at least 20 characters'
    else if (formData.name.length > 60) newErrors.name = 'Name must not exceed 60 characters'
    
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8 || formData.password.length > 16)
      newErrors.password = 'Password must be 8-16 characters'
    else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password))
      newErrors.password = 'Password must contain 1 uppercase and 1 special character'
    
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'
    
    if (formData.address && formData.address.length > 400)
      newErrors.address = 'Address must not exceed 400 characters'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <UserPlus className="text-primary-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up as a normal user</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-xs text-gray-500">(20-60 characters)</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-xs text-gray-500">(8-16 chars, 1 uppercase, 1 special)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-xs text-gray-500">(Optional, max 400)</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Enter your address"
              rows="3"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <button type="submit" className="w-full btn-primary py-3 mt-6">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register