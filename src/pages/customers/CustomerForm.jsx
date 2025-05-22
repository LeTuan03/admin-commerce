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
    Autocomplete,
} from '@mui/material'
import {
    ArrowBack,
    Save,
    NavigateNext,
} from '@mui/icons-material'
import {getCustomers} from "../../services/customersService.js";

const CustomerForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = Boolean(id)

    // Form state
    const [customer, setCustomer] = useState({
        value: '',
        color: '',
        description: '',
        customer: null,
        status: 'Active',
        required: false,
        filterable: true,
        predefinedValues: [],
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [newValue, setNewValue] = useState('')
    const [customers, setCustomers] = useState([])

    const getAllCustomers = async () => {
        try {
            const data = await getCustomers()
            setCustomers(data.data)
        } catch (error) {
            console.error('Error fetching customer:', error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch customer data if editing
    const fetchData = async () => {
        try {
            if (isEditing) {
                // In a real app, this would be an API call with the customer ID
                // For now, we're using mock data
                // const fetchedCustomer = mockCustomers.find(attr => attr.id === parseInt(id))
                //
                // if (fetchedCustomer) {
                //   setCustomer({
                //     ...fetchedCustomer,
                //     required: false,
                //     filterable: true,
                //     predefinedValues: fetchedCustomer.valueType === 'Text'
                //         ? ['Small', 'Medium', 'Large', 'XL']
                //         : [],
                //   })
                // }
            }
        } catch (error) {
            console.error('Error fetching customer data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCustomers()
        fetchData()
    }, [id, isEditing])

    // Handle form changes
    const handleChange = (e, valueSelect ,source) => {
        const { name, value, checked, type } = e.target
        if(source) {
            setCustomer({
                ...customer,
                [source]: valueSelect,
            })
        } else
            // If changing valueType, clear predefined values if switching to non-text
        if (name === 'valueType' && value !== 'Text') {
            setCustomer({
                ...customer,
                valueType: value,
                predefinedValues: [],
            })
        } else {
            setCustomer({
                ...customer,
                [name]: type === 'checkbox' ? checked : value,
            })
        }

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            })
        }
    }

    // Handle adding predefined value
    const handleAddValue = () => {
        if (newValue.trim() && !customer.predefinedValues.includes(newValue.trim())) {
            setCustomer({
                ...customer,
                predefinedValues: [...customer.predefinedValues, newValue.trim()],
            })
            setNewValue('')
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        if (!customer.value.trim()) {
            newErrors.value = 'Customer value is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSaving(true)

        try {
            // In a real app, this would be an API call to save the customer
            // For now, we'll just simulate success
            console.log('Saving customer:', customer)
            let payload = {
                customer: customer.customer,
                value: customer.value,
                color: customer.color,
            }

            // await createCustomerValue(payload)
            // Navigate back to customer list after saving
            // setTimeout(() => {
            //   navigate('/customer')
            // }, 1000)
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
                            {isEditing ? 'Edit Customer' : 'Add Customer'}
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

            <Box component="form" onSubmit={handleSubmit}>
                <Paper sx={{ p: 3, borderRadius: 2, mb: customer.valueType === 'Text' ? 3 : 0 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Customer Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Autocomplete
                                value={customer.customer}
                                onChange={(e, value) => handleChange(e, value, "customer")}
                                options={customers}
                                fullWidth
                                getOptionLabel={item => item.name}
                                renderInput={(params) => <TextField {...params} label="Customer" />}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Customer value"
                                name="value"
                                value={customer.value}
                                onChange={handleChange}
                                required
                                error={!!errors.value}
                                helperText={errors.value}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Customer color"
                                name="color"
                                value={customer.color}
                                onChange={handleChange}
                                required
                                error={!!errors.color}
                                helperText={errors.color}
                            />
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </Box>
    )
}

export default CustomerForm