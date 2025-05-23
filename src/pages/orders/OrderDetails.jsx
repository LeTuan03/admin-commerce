import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
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
    Snackbar,
    Alert
} from '@mui/material'
import {
    NavigateNext,
    ArrowBack,
    LocalShipping,
    Inventory,
    CheckCircle,
    Cancel,
} from '@mui/icons-material'
import {formatCurrency, formatDateTime, getStatusColor} from '../../utils/formatters'
import {getOrdersById, updateStatusOrders, updateOrderDates} from "../../services/ordersService.js";
import {appConst} from "../../utils/constant.js";
import OrderDates from "./OrderDates.jsx";

const OrderDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newStatus, setNewStatus] = useState('')
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch order data
    const fetchOrderData = async () => {
        try {
            // In a real app, this would be an API call with the order ID
            // For now, we're using mock data
            const data = await getOrdersById(id);
            setOrder(data.data)
            setNewStatus(data.data.statusId)
        } catch (error) {
            console.error('Error fetching order data:', error)
            setSnackbar({
                open: true,
                message: 'Failed to load order data',
                severity: 'error'
            });
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderData()
    }, [id])

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    if (loading) {
        return <Box>Loading order details...</Box>
    }

    if (!order) {
        return (
            <Box>
                <Typography variant="h5">Order not found</Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack/>}
                    onClick={() => navigate('/orders')}
                    sx={{mt: 2}}
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

    const handleStatusUpdate = async () => {
        // In a real app, this would be an API call
        try {
            await updateStatusOrders(order.id, newStatus);
            await fetchOrderData();
            setSnackbar({
                open: true,
                message: 'Order status updated successfully',
                severity: 'success'
            });
        } catch (e) {
            console.log(e)
            setSnackbar({
                open: true,
                message: 'Failed to update order status',
                severity: 'error'
            });
        }
    }

    // Handle order dates update
    const handleSaveOrderDates = async (dateData) => {
        try {
            await updateOrderDates(order.id, dateData);
            await fetchOrderData();
            setSnackbar({
                open: true,
                message: 'Order timeline updated successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating order dates:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update order timeline',
                severity: 'error'
            });
        }
    };

    // Calculate order progress step
    const getOrderStep = (status) => {
        switch (status) {
            case appConst.STATUS_ORDER.DANG_XU_LY.id:
                return 0
            case appConst.STATUS_ORDER.DA_XU_LY.id:
                return 1
            case appConst.STATUS_ORDER.DANG_GIAO_HANG.id:
                return 2
            case appConst.STATUS_ORDER.DA_GIAO.id:
                return 3
            case appConst.STATUS_ORDER.DA_HUY.id:
                return -1
            default:
                return 0
        }
    }

    // Calculate order summary
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = 0.00; // Assuming 10% tax
    const shipping = 0.00 // Fixed shipping cost

    // Initial date values for the order
    const initialDates = {
        orderApprovedAt: order.orderApprovedAt || null,
        orderDeliveredCarrierDate: order.orderDeliveredCarrierDate || null,
        orderDeliveredCustomerDate: order.orderDeliveredCustomerDate || null,
    };

    // Whether to disable the date form
    const isDateFormDisabled = order.statusId === appConst.STATUS_ORDER.DA_HUY.id;

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: 'medium', mb: 1}}>
                        Order #{order.id}
                    </Typography>
                    <Breadcrumbs separator={<NavigateNext fontSize="small"/>}>
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
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack/>}
                        onClick={() => navigate('/orders')}
                    >
                        Back
                    </Button>
                </Box>
            </Box>

            {/* Order Status */}
            <Paper sx={{p: 3, mb: 4, borderRadius: 2}}>
                <Box sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Order Status
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Chip
                                label={order?.statusName}
                                color={getStatusColor(order?.statusName)}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Created at: {formatDateTime(order.createdAt)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{display: 'flex', gap: 2, alignItems: 'flex-start'}}>
                        <FormControl sx={{minWidth: 200}}>
                            <InputLabel id="status-update-label">Update Status</InputLabel>
                            <Select
                                labelId="status-update-label"
                                id="status-update"
                                value={newStatus}
                                label="Update Status"
                                onChange={handleStatusChange}
                                disabled={order.statusId === appConst.STATUS_ORDER.DA_HUY.id}
                                size="small"
                            >
                                {appConst.LIST_STATUS_ORDER.map((x) => <MenuItem key={x.id}
                                                                                 value={x.id}>{x.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleStatusUpdate}
                            disabled={newStatus === order.statusId || order.statusId === appConst.STATUS_ORDER.DA_HUY.id}
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{my: 3}}/>

                {order.statusId !== appConst.STATUS_ORDER.DA_HUY.id ? (
                    <Stepper activeStep={getOrderStep(order.statusId)} alternativeLabel>
                        <Step>
                            <StepLabel StepIconProps={{icon: <Inventory/>}}>Order Received</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel StepIconProps={{icon: <LocalShipping/>}}>Processing</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel StepIconProps={{icon: <CheckCircle/>}}>Completed</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Delivered</StepLabel>
                        </Step>
                    </Stepper>
                ) : (
                    <Box sx={{textAlign: 'center', p: 2}}>
                        <Cancel color="error" sx={{fontSize: 48, mb: 2}}/>
                        <Typography variant="h6" color="error.main">
                            This order has been cancelled
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Order Timeline Dates */}
            <OrderDates
                orderId={order.id}
                initialDates={initialDates}
                onSave={handleSaveOrderDates}
                disabled={isDateFormDisabled}
            />

            {/* Order Details */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{p: 3, borderRadius: 2, mb: {xs: 3, md: 0}}}>
                        <Typography variant="h6" gutterBottom>
                            Order Items
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Id</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.productId}>
                                            <TableCell>{item.productId}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell
                                                align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{p: 3, borderRadius: 2, mb: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box sx={{mt: 2}}>
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
                                        Tax (0%)
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
                                    <Divider sx={{my: 1}}/>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontWeight="bold" align="right">
                                        {formatCurrency(order?.totalPrice)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{p: 3, borderRadius: 2}}>
                                <Typography variant="h6" gutterBottom>
                                    Customer Information
                                </Typography>
                                <Box sx={{mt: 2}}>
                                    <Typography variant="subtitle2">
                                        Id: {order.customerId}
                                    </Typography>
                                </Box>
                                <Divider sx={{my: 2}}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default OrderDetails