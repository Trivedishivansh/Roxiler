import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminUsers from './pages/AdminUsers'
import AdminStores from './pages/AdminStores'
import UserStores from './pages/UserStores'
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<Layout />}>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['System Administrator']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/stores" element={<AdminStores />} />
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['Normal User']} />}>
          <Route path="/stores" element={<UserStores />} />
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['Store Owner']} />}>
          <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App