import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material'
import {
    Search,
    FilterList,
    MoreVert,
    Visibility,
    Delete,
    LocalShipping,
} from '@mui/icons-material'
import {DataGrid} from '@mui/x-data-grid'
import {formatCurrency, formatDateTime, getStatusColor} from '../../utils/formatters'
import {deleteOrders, getOrders, updateOrders} from "../../services/ordersService.js";
import {appConst} from "../../utils/constant.js";

const Orders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterAnchor, setFilterAnchor] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [actionAnchor, setActionAnchor] = useState(null)
    const [statusFilter, setStatusFilter] = useState('All')
    const [dateFilter, setDateFilter] = useState('All')

    // Fetch orders data
    const fetchOrders = async () => {
        try {
            // In a real app, this would be an API call
            // For now, we're using mock data
            const data = await getOrders()
            setOrders(data.data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [])

    // Filter orders based on search, status, and date
    const filteredOrders = orders.filter((order) => {
        // Search filter
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.statusName.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter
        const matchesStatus = statusFilter === 'All' || order.statusName === statusFilter

        // Date filter (simplified for demo)
        const orderDate = new Date(order.date)
        let matchesDate = true

        if (dateFilter === 'Today') {
            const today = new Date()
            matchesDate = orderDate.toDateString() === today.toDateString()
        } else if (dateFilter === 'This Week') {
            const today = new Date()
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            matchesDate = orderDate >= weekStart
        } else if (dateFilter === 'This Month') {
            const today = new Date()
            matchesDate =
                orderDate.getMonth() === today.getMonth() &&
                orderDate.getFullYear() === today.getFullYear()
        }

        return matchesSearch && matchesStatus && matchesDate
    })

    // Handle filter menu
    const handleFilterClick = (event) => {
        setFilterAnchor(event.currentTarget)
    }

    const handleFilterClose = () => {
        setFilterAnchor(null)
    }

    // Handle actions menu
    const handleActionClick = (event, order) => {
        event.stopPropagation()
        setSelectedOrder(order)
        setActionAnchor(event.currentTarget)
    }

    const handleActionClose = () => {
        setActionAnchor(null)
    }

    // Handle order actions
    const handleViewOrder = () => {
        navigate(`/orders/${selectedOrder.id}`)
        handleActionClose()
    }

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true)
        handleActionClose()
    }

    const handleDeleteConfirm = async () => {
        // In a real app, this would be an API call
        // setOrders(orders.filter((order) => order.id !== selectedOrder.id))
        // setDeleteDialogOpen(false)

        try {
            await deleteOrders(selectedOrder.id);
            await fetchOrders();
        } catch (e) {
            console.error(e);
        }
        setDeleteDialogOpen(false)
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
    }

    const handleUpdateStatus = async (newStatus) => {
        // In a real app, this would be an API call
        // const updatedOrders = orders.map((order) => {
        //   if (order.id === selectedOrder.id) {
        //     return { ...order, status: newStatus }
        //   }
        //   return order
        // })
        //
        // setOrders(updatedOrders)
        // handleActionClose()

        try {
            let payload = {
                statusId: newStatus,
                customerId: selectedOrder?.customerId,
                couponId: selectedOrder?.couponId,
                orderApprovedAt: selectedOrder?.orderApprovedAt,
                orderDeliveredCarrierDate: selectedOrder?.orderDeliveredCarrierDate,
                orderDeliveredCustomerDate: selectedOrder?.orderDeliveredCustomerDate,
                items: selectedOrder?.items,
            }
            await updateOrders(selectedOrder?.id, payload);
            await fetchOrders();
        } catch (e) {
            console.log(e)
        } finally {
            handleActionClose()
        }
    }

    // Handle status filter change
    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value)
        handleFilterClose()
    }

    // Handle date filter change
    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value)
        handleFilterClose()
    }

    // DataGrid columns
    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="medium">
                    #{params.value}
                </Typography>
            ),
        },
        {
            field: 'customerId',
            headerName: 'Customer ID',
            width: 240,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="medium">
                    #{params.value}
                </Typography>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 180,
            valueFormatter: (params) => formatDateTime(params.value),
        },
        {
            field: 'totalPrice',
            headerName: 'Total',
            width: 120,
            valueFormatter: (params) => formatCurrency(params.value),
        },
        {
            field: 'statusName',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value
                return (
                    <Chip
                        label={status}
                        color={getStatusColor(status)}
                        size="small"
                    />
                )
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={(e) => handleActionClick(e, params.row)}
                    size="small"
                >
                    <MoreVert fontSize="small"/>
                </IconButton>
            ),
        },
    ]

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Typography variant="h4" sx={{fontWeight: 'medium'}}>
                    Orders
                </Typography>
            </Box>

            <Paper sx={{p: 3, mb: 4, borderRadius: 2}}>
                <Box sx={{display: 'flex', gap: 2, mb: 3}}>
                    <TextField
                        placeholder="Search orders..."
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />

                    <Button
                        variant="outlined"
                        startIcon={<FilterList/>}
                        onClick={handleFilterClick}
                        size="small"
                    >
                        Filters
                    </Button>
                </Box>

                {/* Status chips for quick filtering */}
                <Stack direction="row" spacing={1} sx={{mb: 3, flexWrap: 'wrap', gap: 1}}>
                    <Chip
                        label="All Orders"
                        onClick={() => setStatusFilter('All')}
                        color={statusFilter === 'All' ? 'primary' : 'default'}
                        variant={statusFilter === 'All' ? 'filled' : 'outlined'}
                    />
                    <Chip
                        label={appConst.STATUS_ORDER.DANG_XU_LY.name}
                        onClick={() => setStatusFilter(appConst.STATUS_ORDER.DANG_XU_LY.name)}
                        color={statusFilter === appConst.STATUS_ORDER.DANG_XU_LY.name ? 'warning' : 'default'}
                        variant={statusFilter === appConst.STATUS_ORDER.DANG_XU_LY.name ? 'filled' : 'outlined'}
                    />
                    <Chip
                        label={appConst.STATUS_ORDER.DA_XU_LY.name}
                        onClick={() => setStatusFilter(appConst.STATUS_ORDER.DA_XU_LY.name)}
                        color={statusFilter === appConst.STATUS_ORDER.DA_XU_LY.name ? 'info' : 'default'}
                        variant={statusFilter === appConst.STATUS_ORDER.DA_XU_LY.name ? 'filled' : 'outlined'}
                    />
                    <Chip
                        label={appConst.STATUS_ORDER.DANG_GIAO_HANG.name}
                        onClick={() => setStatusFilter(appConst.STATUS_ORDER.DANG_GIAO_HANG.name)}
                        color={statusFilter === appConst.STATUS_ORDER.DANG_GIAO_HANG.name ? 'success' : 'default'}
                        variant={statusFilter === appConst.STATUS_ORDER.DANG_GIAO_HANG.name ? 'filled' : 'outlined'}
                    />
                    <Chip
                        label={appConst.STATUS_ORDER.DA_GIAO.name}
                        onClick={() => setStatusFilter(appConst.STATUS_ORDER.DA_GIAO.name)}
                        color={statusFilter === appConst.STATUS_ORDER.DA_GIAO.name ? 'success' : 'default'}
                        variant={statusFilter === appConst.STATUS_ORDER.DA_GIAO.name ? 'filled' : 'outlined'}
                    />
                    <Chip
                        label={appConst.STATUS_ORDER.DA_HUY.name}
                        onClick={() => setStatusFilter(appConst.STATUS_ORDER.DA_HUY.name)}
                        color={statusFilter === appConst.STATUS_ORDER.DA_HUY.name ? 'error' : 'default'}
                        variant={statusFilter === appConst.STATUS_ORDER.DA_HUY.name ? 'filled' : 'outlined'}
                    />
                </Stack>

                <Box sx={{height: 600}}>
                    <DataGrid
                        rows={filteredOrders}
                        columns={columns}
                        loading={loading}
                        autoPageSize
                        disableRowSelectionOnClick
                        onRowClick={(params) => navigate(`/orders/${params.row.id}`)}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
                            },
                            '& .MuiDataGrid-row': {
                                cursor: 'pointer',
                            },
                            border: 'none',
                        }}
                    />
                </Box>
            </Paper>

            {/* Filter Menu */}
            <Menu
                anchorEl={filterAnchor}
                open={Boolean(filterAnchor)}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: {width: 250},
                }}
            >
                <MenuItem>
                    <Typography variant="subtitle2">Order Status</Typography>
                </MenuItem>
                <FormControl fullWidth sx={{mx: 2, my: 1, width: 'calc(100% - 32px)'}}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="Status"
                        onChange={handleStatusFilterChange}
                        size="small"
                    >
                        <MenuItem value="All">All Orders</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                <Divider sx={{my: 1}}/>

                <MenuItem>
                    <Typography variant="subtitle2">Order Date</Typography>
                </MenuItem>
                <FormControl fullWidth sx={{mx: 2, my: 1, width: 'calc(100% - 32px)'}}>
                    <InputLabel id="date-filter-label">Date</InputLabel>
                    <Select
                        labelId="date-filter-label"
                        id="date-filter"
                        value={dateFilter}
                        label="Date"
                        onChange={handleDateFilterChange}
                        size="small"
                    >
                        <MenuItem value="All">All Time</MenuItem>
                        <MenuItem value="Today">Today</MenuItem>
                        <MenuItem value="This Week">This Week</MenuItem>
                        <MenuItem value="This Month">This Month</MenuItem>
                    </Select>
                </FormControl>
            </Menu>

            {/* Actions Menu */}
            <Menu
                anchorEl={actionAnchor}
                open={Boolean(actionAnchor)}
                onClose={handleActionClose}
            >
                <MenuItem onClick={handleViewOrder}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Visibility fontSize="small"/>
                        <Typography>View Details</Typography>
                    </Stack>
                </MenuItem>

                <Divider/>

                {/*<MenuItem>*/}
                {/*  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: 'text.secondary', pl: 1 }}>*/}
                {/*    Update Status*/}
                {/*  </Typography>*/}
                {/*</MenuItem>*/}

                {/*<MenuItem onClick={() => handleUpdateStatus('Processing')}>*/}
                {/*  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'warning.main' }}>*/}
                {/*    <LocalShipping fontSize="small" />*/}
                {/*    <Typography>Processing</Typography>*/}
                {/*  </Stack>*/}
                {/*</MenuItem>*/}

                {/*<MenuItem onClick={() => handleUpdateStatus('Completed')}>*/}
                {/*  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'success.main' }}>*/}
                {/*    <CheckCircle fontSize="small" />*/}
                {/*    <Typography>Completed</Typography>*/}
                {/*  </Stack>*/}
                {/*</MenuItem>*/}

                <MenuItem onClick={() => handleUpdateStatus(appConst.STATUS_ORDER.DA_HUY.id)}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{color: 'warning.main'}}>
                        <LocalShipping fontSize="small"/>
                        <Typography>Cancel</Typography>
                    </Stack>
                </MenuItem>

                <Divider/>

                <MenuItem onClick={handleDeleteClick}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{color: 'error.main'}}>
                        <Delete fontSize="small"/>
                        <Typography>Delete</Typography>
                    </Stack>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Delete Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete order #{selectedOrder?.id}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Orders