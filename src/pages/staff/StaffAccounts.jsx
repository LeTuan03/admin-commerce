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
} from '@mui/material'
import {
    Add,
    Search,
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Block,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { format } from 'date-fns'

// Mock data for demonstration
const mockStaffAccounts = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        first_name: 'John Smith',
        phone_number: '+1234567890',
        email: 'john.smith@example.com',
        role: { name: 'Admin' },
        active: true,
        image: 'https://i.pravatar.cc/150?img=1',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
        createdBy: { first_name: 'Admin User' },
        updatedBy: { first_name: 'Admin User' },
    },
    // Add more mock data as needed
]

const StaffAccounts = () => {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [actionAnchor, setActionAnchor] = useState(null)

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // In a real app, this would be an API call
                setAccounts(mockStaffAccounts)
            } catch (error) {
                console.error('Error fetching staff accounts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAccounts()
    }, [])

    const filteredAccounts = accounts.filter((account) =>
        account.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.phone_number?.includes(searchTerm)
    )

    const handleActionClick = (event, account) => {
        event.stopPropagation()
        setSelectedAccount(account)
        setActionAnchor(event.currentTarget)
    }

    const handleActionClose = () => {
        setActionAnchor(null)
    }

    const handleEditAccount = () => {
        navigate(`/staff/edit/${selectedAccount.id}`)
        handleActionClose()
    }

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true)
        handleActionClose()
    }

    const handleDeleteConfirm = () => {
        setAccounts(accounts.filter((account) => account.id !== selectedAccount.id))
        setDeleteDialogOpen(false)
    }

    const handleToggleStatus = () => {
        setAccounts(accounts.map((account) => {
            if (account.id === selectedAccount.id) {
                return { ...account, active: !account.active }
            }
            return account
        }))
        handleActionClose()
    }

    const columns = [
        {
            field: 'first_name',
            headerName: 'Name',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'phone_number',
            headerName: 'Phone',
            width: 150,
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            valueGetter: (params) => params.row.role?.name,
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
            field: 'created_at',
            headerName: 'Created',
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
                    Staff Accounts
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => navigate('/staff/new')}
                >
                    Add Staff Account
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        placeholder="Search staff accounts..."
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
                        rows={filteredAccounts}
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
                    navigate(`/staff/${selectedAccount?.id}`)
                    handleActionClose()
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Visibility fontSize="small" />
                        <Typography>View Details</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleEditAccount}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Edit fontSize="small" />
                        <Typography>Edit</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: selectedAccount?.active ? 'error.main' : 'success.main' }}>
                        <Block fontSize="small" />
                        <Typography>{selectedAccount?.active ? 'Deactivate' : 'Activate'}</Typography>
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
                <DialogTitle>Delete Staff Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the account for "{selectedAccount?.first_name}"? This action cannot be undone.
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

export default StaffAccounts