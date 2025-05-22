import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Button,
  useTheme,
} from '@mui/material'
import {
  ShoppingCart,
  Inventory,
  People,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Dashboard as DashboardIcon,
  MoreVert,
} from '@mui/icons-material'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { formatCurrency } from '../utils/formatters'
import { mockDashboardData } from '../utils/mockData'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Overview = () => {
  const theme = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we're using mock data
        setData(mockDashboardData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading || !data) {
    return <Box>Loading dashboard...</Box>
  }
  
  // Sales Chart Data
  const salesChartData = {
    labels: data.salesChart.labels,
    datasets: [
      {
        label: 'Sales',
        data: data.salesChart.data,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '20',
        tension: 0.4,
        fill: true,
      },
    ],
  }
  
  // Sales Chart Options
  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  }
  
  // Category Distribution Data
  const categoryChartData = {
    labels: data.categoryDistribution.labels,
    datasets: [
      {
        label: 'Products',
        data: data.categoryDistribution.data,
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main,
        ],
      },
    ],
  }
  
  // Category Chart Options
  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    maintainAspectRatio: false,
  }
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'medium' }}>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main + '15', 
                    color: theme.palette.primary.main,
                    mr: 2,
                  }}
                >
                  <AttachMoney />
                </Avatar>
                <Typography color="textSecondary" variant="body2">
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatCurrency(data.stats.totalRevenue)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={data.stats.revenueChange >= 0 ? "success.main" : "error.main"}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {data.stats.revenueChange >= 0 ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
                  {Math.abs(data.stats.revenueChange)}%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.secondary.main + '15', 
                    color: theme.palette.secondary.main,
                    mr: 2,
                  }}
                >
                  <ShoppingCart />
                </Avatar>
                <Typography color="textSecondary" variant="body2">
                  Total Orders
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {data.stats.totalOrders.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={data.stats.ordersChange >= 0 ? "success.main" : "error.main"}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {data.stats.ordersChange >= 0 ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
                  {Math.abs(data.stats.ordersChange)}%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.success.main + '15', 
                    color: theme.palette.success.main,
                    mr: 2,
                  }}
                >
                  <Inventory />
                </Avatar>
                <Typography color="textSecondary" variant="body2">
                  Total Products
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {data.stats.totalProducts.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={data.stats.productsChange >= 0 ? "success.main" : "error.main"}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {data.stats.productsChange >= 0 ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
                  {Math.abs(data.stats.productsChange)}%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.error.main + '15', 
                    color: theme.palette.error.main,
                    mr: 2,
                  }}
                >
                  <People />
                </Avatar>
                <Typography color="textSecondary" variant="body2">
                  Total Customers
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {data.stats.totalCustomers.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={data.stats.customersChange >= 0 ? "success.main" : "error.main"}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {data.stats.customersChange >= 0 ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
                  {Math.abs(data.stats.customersChange)}%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Sales Overview</Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line data={salesChartData} options={salesChartOptions} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Product Categories</Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar data={categoryChartData} options={categoryChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Orders and Low Stock */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button color="primary" size="small">View All</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {data.recentOrders.map((order) => (
                <ListItem
                  key={order.id}
                  secondaryAction={
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                    >
                      {formatCurrency(order.total)}
                    </Typography>
                  }
                  sx={{ px: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main + '15', color: theme.palette.primary.main }}>
                      <ShoppingCart fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Order #${order.id}`}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {order.date}
                        </Typography>
                        <Box 
                          component="span" 
                          sx={{ 
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            backgroundColor: 
                              order.status === 'Completed' ? theme.palette.success.main + '20' :
                              order.status === 'Processing' ? theme.palette.warning.main + '20' :
                              order.status === 'Pending' ? theme.palette.info.main + '20' :
                              theme.palette.error.main + '20',
                            color: 
                              order.status === 'Completed' ? theme.palette.success.main :
                              order.status === 'Processing' ? theme.palette.warning.main :
                              order.status === 'Pending' ? theme.palette.info.main :
                              theme.palette.error.main,
                          }}
                        >
                          {order.status}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Low Stock Products</Typography>
              <Button color="primary" size="small">View All</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {data.lowStockProducts.map((product) => (
                <ListItem
                  key={product.id}
                  secondaryAction={
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        backgroundColor: theme.palette.error.main + '20',
                        color: theme.palette.error.main,
                      }}
                    >
                      {product.stock} left
                    </Box>
                  }
                  sx={{ px: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={product.image} 
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={product.name}
                    secondary={formatCurrency(product.price)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Overview