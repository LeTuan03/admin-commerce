import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  Avatar,
  Tooltip,
  Box,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SettingsIcon from '@mui/icons-material/Settings'
import { useAuth } from '../../contexts/AuthContext'

const TopBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [notificationAnchor, setNotificationAnchor] = useState(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget)
  }
  
  const handleNotificationClose = () => {
    setNotificationAnchor(null)
  }
  
  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const handleAccountClick = () => {
    navigate('/account')
    handleUserMenuClose()
  }
  
  // Mock notifications
  const notifications = [
    { id: 1, message: 'New order received', time: '5 min ago' },
    { id: 2, message: 'Product inventory low', time: '1 hour ago' },
    { id: 3, message: 'New user registered', time: '3 hours ago' },
  ]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Notifications */}
      <Tooltip title="Notifications">
        <IconButton 
          color="inherit" 
          onClick={handleNotificationClick}
          size="large"
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { 
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleNotificationClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body1">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography>No new notifications</Typography>
          </MenuItem>
        )}
      </Menu>
      
      {/* User Menu */}
      <Tooltip title="Account settings">
        <IconButton
          color="inherit"
          onClick={handleUserMenuClick}
          size="large"
          sx={{ ml: 2 }}
        >
          <Avatar 
            src={user?.avatar}
            alt={user?.name || 'User'}
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: { width: 200 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">{user?.name}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleAccountClick}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default TopBar