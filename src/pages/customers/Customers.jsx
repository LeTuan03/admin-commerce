import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    Tabs,
    Tab,
} from '@mui/material'
import {
    Add,
    Search,
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Block,
    LocationOn,
    ShoppingCart,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { format } from 'date-fns'
import {getCustomers} from "../../services/customersService.js";

// Mock data for demonstration
const mockCustomers = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        active: true,
        registeredAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
        totalOrders: 15,
        totalSpent: 2580.45,
        addresses: [
            {
                id: '1',
                line1: '123 Main St',
                line2: 'Apt 4B',
                city: 'New York',
                country: 'USA',
                postalCode: '10001',
                phoneNumber: '+1234567890',
            }
        ]
    },
    // Add more mock data as needed
]

const Customers = () => {
    const navigate = useNavigate()
    const [customer, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [actionAnchor, setActionAnchor] = useState(null)
    const [tabValue, setTabValue] = useState(0)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // In a real app, this would be an API call
                const data = await getCustomers()
                setCustomers(data.data)
            } catch (error) {
                console.error('Error fetching customer:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    const filteredCustomers = customer.filter((customer) =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleActionClick = (event, customer) => {
        event.stopPropagation()
        setSelectedCustomer(customer)
        setActionAnchor(event.currentTarget)
    }

    const handleActionClose = () => {
        setActionAnchor(null)
    }

    const handleEditCustomer = () => {
        navigate(`/customer/edit/${selectedCustomer.id}`)
        handleActionClose()
    }

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true)
        handleActionClose()
    }

    const handleDeleteConfirm = () => {
        setCustomers(customer.filter((customer) => customer.id !== selectedCustomer.id))
        setDeleteDialogOpen(false)
    }

    const handleToggleStatus = () => {
        setCustomers(customer.map((customer) => {
            if (customer.id === selectedCustomer.id) {
                return { ...customer, active: !customer.active }
            }
            return customer
        }))
        handleActionClose()
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 180,
            valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'totalOrders',
            headerName: 'Orders',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            ),
        },
        {
            field: 'totalSpent',
            headerName: 'Total Spent',
            width: 150,
            valueFormatter: (params) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(params.value),
        },
        {
            field: 'active',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Active' : 'Inactive'}
                    color={params.value ? 'success' : 'error'}
                    size="small"
                />
            ),
        },
        {
            field: 'registeredAt',
            headerName: 'Registered',
            width: 180,
            valueFormatter: (params) => format(new Date(params.value), 'MMM d, yyyy HH:mm'),
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
                    <MoreVert fontSize="small" />
                </IconButton>
            ),
        },
    ]

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
                    Customers
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => navigate('/customer/new')}
                >
                    Add Customer
                </Button>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="All Customers" />
                    <Tab label="Active" />
                    <Tab label="Inactive" />
                </Tabs>
            </Paper>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        placeholder="Search customer..."
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />
                </Box>

                <Box sx={{ height: 600 }}>
                    <DataGrid
                        rows={filteredCustomers}
                        columns={columns}
                        loading={loading}
                        autoPageSize
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
                            },
                            border: 'none',
                        }}
                    />
                </Box>
            </Paper>

            {/* Actions Menu */}
            <Menu
                anchorEl={actionAnchor}
                open={Boolean(actionAnchor)}
                onClose={handleActionClose}
            >
                <MenuItem onClick={() => {
                    navigate(`/customer/${selectedCustomer?.id}`)
                    handleActionClose()
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Visibility fontSize="small" />
                        <Typography>View Details</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleEditCustomer}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Edit fontSize="small" />
                        <Typography>Edit</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={() => {
                    navigate(`/customer/${selectedCustomer?.id}/addresses`)
                    handleActionClose()
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOn fontSize="small" />
                        <Typography>Addresses</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={() => {
                    navigate(`/customer/${selectedCustomer?.id}/orders`)
                    handleActionClose()
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <ShoppingCart fontSize="small" />
                        <Typography>Orders</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: selectedCustomer?.active ? 'error.main' : 'success.main' }}>
                        <Block fontSize="small" />
                        <Typography>{selectedCustomer?.active ? 'Deactivate' : 'Activate'}</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'error.main' }}>
                        <Delete fontSize="small" />
                        <Typography>Delete</Typography>
                    </Stack>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Customer Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this customer account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
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

export default Customers