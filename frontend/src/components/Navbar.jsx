import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, Users, Store, Star, LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  const isActive = (path) => location.pathname === path

  const navLinks = {
    'System Administrator': [
      { to: '/dashboard', icon: Home, label: 'Dashboard' },
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/stores', icon: Store, label: 'Stores' },
    ],
    'Normal User': [
      { to: '/stores', icon: Store, label: 'Browse Stores' },
    ],
    'Store Owner': [
      { to: '/owner/dashboard', icon: Star, label: 'My Store' },
    ],
  }

  const links = navLinks[user.role] || []

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              StoreRating
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User size={18} />
              <span className="hidden md:inline">{user.name}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar