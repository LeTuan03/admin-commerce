import { Box, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Home } from '@mui/icons-material'

const NotFound = () => {
  const navigate = useNavigate()
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="h1" 
          color="primary" 
          sx={{ 
            fontSize: { xs: '5rem', sm: '8rem' },
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2,
            textAlign: 'center',
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<Home />}
          size="large"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  )
}

export default NotFound