import { createContext, useState, useContext, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Create theme context
const ThemeContext = createContext()

// Theme provider component
export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light')
  
  // Toggle theme mode
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }
  
  // Create theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#4E6688', // indigo
      },
      secondary: {
        main: '#00bcd4', // teal
      },
      error: {
        main: '#FE5D26', // red
      },
      warning: {
        main: '#ffc107', // amber
      },
      info: {
        main: '#2196f3', // blue
      },
      success: {
        main: '#4caf50', // green
      },
      accent: {
        main: '#ff9800', // orange
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 500,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 400,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 400,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 400,
        fontSize: '1rem',
      },
      button: {
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.05)'
              : '0px 2px 4px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      },
    },
  }), [mode])
  
  // Theme context value
  const value = {
    mode,
    toggleTheme,
  }
  
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}