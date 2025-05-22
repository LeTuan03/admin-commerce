import { createContext, useState, useContext, useEffect } from 'react'

// Create auth context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])
  
  // Login function
  const login = (userData) => {
    // In a real app, this would validate credentials with an API
    // For this demo, we'll just accept any valid-looking credentials
    if (userData.email && userData.password) {
      const user = { 
        id: 1, 
        name: 'Admin User', 
        email: userData.email,
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=68'
      }
      
      setUser(user)
      localStorage.setItem('adminUser', JSON.stringify(user))
      return true
    }
    return false
  }
  
  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminUser')
  }
  
  // Auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}