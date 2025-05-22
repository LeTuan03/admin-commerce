import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './contexts/AuthContext'
import { AppThemeProvider } from './contexts/ThemeContext'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppThemeProvider>
          <CssBaseline />
          <App />
        </AppThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)