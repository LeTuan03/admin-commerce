import { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    Chip,
} from '@mui/material'
import {
    Search,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { format } from 'date-fns'
import {getCustomers} from "../../services/customersService.js";

const Customers = () => {
    const [customer, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

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
    ]

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
                    Customers
                </Typography>
            </Box>

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
        </Box>
    )
}

export default Customers