import {
  List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Avatar, Typography, Divider,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Style as StyleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  ExpandLess,
  ExpandMore,
  ProductionQuantityLimits,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const menuItems = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    label: 'Orders',
    icon: <ShoppingCartIcon />,
    path: '/orders',
  },
  {
    label: 'Products',
    icon: <InventoryIcon />,
    children: [
      { label: 'All Products', icon: <ProductionQuantityLimits />, path: '/products' },
      { label: 'Categories', icon: <CategoryIcon />, path: '/categories' },
      { label: 'Product Gallery', icon: <StyleIcon />, path: '/product-gallery' },
      { label: 'Product Attributes', icon: <StyleIcon />, path: '/product-attributes' },
      { label: 'Product Attributes Value', icon: <StyleIcon />, path: '/product-attributes-value' },
      { label: 'Attributes', icon: <StyleIcon />, path: '/attributes' },
      { label: 'Attributes Value', icon: <StyleIcon />, path: '/attributes-value' },
      { label: 'Coupon', icon: <StyleIcon />, path: '/coupon' },
      { label: 'Country', icon: <StyleIcon />, path: '/country' },
      // { label: 'Customer Address', icon: <StyleIcon />, path: '/customer' },
    ],
  },
  {
    label: 'Customer',
    icon: <GroupIcon />,
    path: '/customer',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { label: 'Account', icon: <PersonIcon />, path: '/account' },
    ],
  },
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openGroups, setOpenGroups] = useState({})

  const handleToggle = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const renderMenuItem = (item, depth = 0) => {
    const isSelected = location.pathname === item.path
    const hasChildren = !!item.children?.length
    const paddingLeft = 2 + depth * 2

    return (
        <div key={item.label}>
          <ListItemButton
              onClick={() => hasChildren ? handleToggle(item.label) : navigate(item.path)}
              selected={!hasChildren && isSelected}
              sx={{ pl: paddingLeft }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {hasChildren && (openGroups[item.label] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {hasChildren && (
              <Collapse in={openGroups[item.label]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {item.children.map((child) => renderMenuItem(child, depth + 1))}
                </List>
              </Collapse>
          )}
        </div>
    )
  }

  return (
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2, textAlign: 'center', mb: 2 }}>
          <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">{user?.name}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.role}</Typography>
        </Box>

        <Divider />

        <List component="nav">
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>
  )
}

export default Sidebar
