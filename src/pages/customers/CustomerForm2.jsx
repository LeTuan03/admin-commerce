import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Breadcrumbs,
    Link,
    Switch,
    FormControlLabel,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material'
import {
    ArrowBack,
    Save,
    NavigateNext,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'

const CustomerForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = Boolean(id)

    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        active: true,
        addresses: [],
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchCustomerData = async () => {
            if (isEditing) {
                try {
                    // In a real app, this would be an API call
                    const mockCustomer = {
                        id: id,
                        firstName: 'John',
                        lastName: 'Smith',
                        email: 'john.smith@example.com',
                        active: true,
                        registeredAt: new Date(),
                        updatedAt: new Date(),
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
                    }
                    setCustomer(mockCustomer)
                } catch (error) {
                    console.error('Error fetching customer data:', error)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchCustomerData()
    }, [id, isEditing])

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target
        setCustomer({
            ...customer,
            [name]: type === 'checkbox' ? checked : value,
        })

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!customer.firstName?.trim()) {
            newErrors.firstName = 'First name is required'
        }

        if (!customer.lastName?.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (!customer.email?.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
            newErrors.email = 'Invalid email address'
        }

        if (!isEditing) {
            if (!customer.password) {
                newErrors.password = 'Password is required'
            } else if (customer.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters'
            }

            if (customer.password !== customer.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSaving(true)

        try {
            // In a real app, this would be an API call
            console.log('Saving customer:', customer)

            setTimeout(() => {
                navigate('/customer')
            }, 1000)
        } catch (error) {
            console.error('Error saving customer:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Typography>Loading customer data...</Typography>
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {isEditing ? 'Edit Customer' : 'Add New Customer'}
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
                                navigate('/customer')
                            }}
                        >
                            Customers
                        </Link>
                        <Typography color="text.primary">
                            {isEditing ? 'Edit Customer' : 'New Customer'}
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/customer')}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Customer'}
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Customer Information
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={customer.firstName}
                                    onChange={handleChange}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={customer.lastName}
                                    onChange={handleChange}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={customer.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                />
                            </Grid>

                            {!isEditing && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type="password"
                                            value={customer.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={customer.confirmPassword}
                                            onChange={handleChange}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            required
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={customer.active}
                                            onChange={handleChange}
                                            name="active"
                                            color="primary"
                                        />
                                    }
                                    label="Active Account"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Addresses
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => navigate(`/customer/${id}/addresses/new`)}
                                disabled={!isEditing}
                            >
                                Add Address
                            </Button>
                        </Box>

                        <List>
                            {customer.addresses?.map((address, index) => (
                                <ListItem key={index} divider={index < customer.addresses.length - 1}>
                                    <ListItemText
                                        primary={address.line1}
                                        secondary={
                                            <>
                                                {address.line2 && <div>{address.line2}</div>}
                                                <div>{`${address.city}, ${address.country} ${address.postalCode}`}</div>
                                                <div>{address.phoneNumber}</div>
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => navigate(`/customer/${id}/addresses/${address.id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}

                            {customer.addresses?.length === 0 && (
                                <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                    No addresses added yet
                                </Typography>
                            )}
                        </List>
                    </Paper>

                    {isEditing && (
                        <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Account Details
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Registered: {format(new Date(customer.registeredAt), 'MMM d, yyyy HH:mm')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Last Updated: {format(new Date(customer.updatedAt), 'MMM d, yyyy HH:mm')}
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}

export default CustomerForm