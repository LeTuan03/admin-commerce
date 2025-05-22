import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from './contexts/AuthContext'

import Dashboard from './layouts/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import {protectedRoutes} from "./routes/routes.jsx";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Auto scroll top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            {protectedRoutes.map(({ path, element, index }, i) => (
                <Route key={i} path={path} index={index} element={element} />
            ))}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
  )
}

export default App
