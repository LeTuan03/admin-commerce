import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import {
  NavigateNext,
  ArrowBack,
  LocalShipping,
  Inventory,
  CheckCircle,
  Cancel,
  Print,
  MailOutline,
} from '@mui/icons-material'
import { mockOrders } from '../../utils/mockData'
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  
  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // In a real app, this would be an API call with the order ID
        // For now, we're using mock data
        const foundOrder = mockOrders.find(order => order.id === id)
        
        if (foundOrder) {
          setOrder(foundOrder)
          setNewStatus(foundOrder.status)
        }
      } catch (error) {
        console.error('Error fetching order data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrderData()
  }, [id])
  
  if (loading) {
    return <Box>Loading order details...</Box>
  }
  
  if (!order) {
    return (
      <Box>
        <Typography variant="h5">Order not found</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    )
  }
  
  // Handle status update
  const handleStatusChange = (event) => {
    setNewStatus(event.target.value)
  }
  
  const handleStatusUpdate = () => {
    // In a real app, this would be an API call
    setOrder({ ...order, status: newStatus })
  }
  
  // Handle cancel order
  const handleCancelOrder = () => {
    setCancelDialogOpen(true)
  }
  
  const confirmCancelOrder = () => {
    // In a real app, this would be an API call
    setOrder({ ...order, status: 'Cancelled' })
    setNewStatus('Cancelled')
    setCancelDialogOpen(false)
  }
  
  // Calculate order progress step
  const getOrderStep = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 0
      case 'processing':
        return 1
      case 'completed':
        return 2
      case 'delivered':
        return 3
      case 'cancelled':
        return -1
      default:
        return 0
    }
  }
  
  // Calculate order summary
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1 // Assuming 10% tax
  const shipping = 15.00 // Fixed shipping cost
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
            Order #{order.id}
          </Typography>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              Dashboard
            </Link>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/orders')
              }}
            >
              Orders
            </Link>
            <Typography color="text.primary">
              Order #{order.id}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<MailOutline />}
          >
            Email
          </Button>
        </Box>
      </Box>
      
      {/* Order Status */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={order.status} 
                color={getStatusColor(order.status)}
              />
              <Typography variant="body2" color="text.secondary">
                Last Updated: {formatDateTime(order.date)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="status-update-label">Update Status</InputLabel>
              <Select
                labelId="status-update-label"
                id="status-update"
                value={newStatus}
                label="Update Status"
                onChange={handleStatusChange}
                disabled={order.status === 'Cancelled'}
                size="small"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              onClick={handleStatusUpdate}
              disabled={newStatus === order.status || order.status === 'Cancelled'}
            >
              Update
            </Button>
            
            {order.status !== 'Cancelled' && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {order.status !== 'Cancelled' ? (
          <Stepper activeStep={getOrderStep(order.status)} alternativeLabel>
            <Step>
              <StepLabel StepIconProps={{ icon: <Inventory /> }}>Order Received</StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconProps={{ icon: <LocalShipping /> }}>Processing</StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconProps={{ icon: <CheckCircle /> }}>Completed</StepLabel>
            </Step>
            <Step>
              <StepLabel>Delivered</StepLabel>
            </Step>
          </Stepper>
        ) : (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Cancel color="error" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" color="error.main">
              This order has been cancelled
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Order Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {formatCurrency(subtotal)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tax (10%)
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {formatCurrency(tax)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {formatCurrency(shipping)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold" align="right">
                    {formatCurrency(order.total)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    {order.customerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.email}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.address}
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.country}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Payment Method
                </Typography>
                <Typography variant="body2">
                  {order.paymentMethod}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order #{order.id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} color="primary">
            No, Keep Order
          </Button>
          <Button onClick={confirmCancelOrder} color="error">
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderDetails