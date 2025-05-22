import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Breadcrumbs,
    Link,
    Avatar,
    Switch,
    FormControlLabel,
    IconButton,
} from '@mui/material'
import {
    ArrowBack,
    Save,
    NavigateNext,
    Upload,
} from '@mui/icons-material'
import { format } from 'date-fns'

// Mock roles data
const mockRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Staff' },
]

const StaffForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = Boolean(id)

    const [staff, setStaff] = useState({
        first_name: '',
        phone_number: '',
        email: '',
        role_id: '',
        active: true,
        image: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchStaffData = async () => {
            if (isEditing) {
                try {
                    // In a real app, this would be an API call
                    const mockStaff = {
                        id: id,
                        first_name: 'John Smith',
                        phone_number: '+1234567890',
                        email: 'john.smith@example.com',
                        role_id: 1,
                        active: true,
                        image: 'https://i.pravatar.cc/150?img=1',
                        created_at: new Date(),
                        updated_at: new Date(),
                    }
                    setStaff(mockStaff)
                } catch (error) {
                    console.error('Error fetching staff data:', error)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchStaffData()
    }, [id, isEditing])

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target
        setStaff({
            ...staff,
            [name]: type === 'checkbox' ? checked : value,
        })

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            })
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // In a real app, this would upload to a server
            const imageUrl = URL.createObjectURL(file)
            setStaff({
                ...staff,
                image: imageUrl,
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!staff.first_name?.trim()) {
            newErrors.first_name = 'Name is required'
        }

        if (!staff.email?.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(staff.email)) {
            newErrors.email = 'Invalid email address'
        }

        if (!staff.role_id) {
            newErrors.role_id = 'Role is required'
        }

        if (!isEditing) {
            if (!staff.password) {
                newErrors.password = 'Password is required'
            } else if (staff.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters'
            }

            if (staff.password !== staff.confirmPassword) {
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
            console.log('Saving staff account:', staff)

            setTimeout(() => {
                navigate('/staff')
            }, 1000)
        } catch (error) {
            console.error('Error saving staff account:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Typography>Loading staff data...</Typography>
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {isEditing ? 'Edit Staff Account' : 'Add Staff Account'}
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
                                navigate('/staff')
                            }}
                        >
                            Staff
                        </Link>
                        <Typography color="text.primary">
                            {isEditing ? 'Edit Account' : 'New Account'}
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/staff')}
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
                        {saving ? 'Saving...' : 'Save Account'}
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src={staff.image}
                                alt={staff.first_name}
                                sx={{ width: 150, height: 150, mb: 2 }}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<Upload />}
                            >
                                Upload Photo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        </Box>

                        {isEditing && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Created: {format(new Date(staff.created_at), 'MMM d, yyyy HH:mm')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Last Updated: {format(new Date(staff.updated_at), 'MMM d, yyyy HH:mm')}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Account Information
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="first_name"
                                    value={staff.first_name}
                                    onChange={handleChange}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={staff.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone_number"
                                    value={staff.phone_number}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.role_id}>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="role_id"
                                        value={staff.role_id}
                                        onChange={handleChange}
                                        label="Role"
                                    >
                                        {mockRoles.map((role) => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={staff.active}
                                            onChange={handleChange}
                                            name="active"
                                            color="primary"
                                        />
                                    }
                                    label="Active Account"
                                />
                            </Grid>

                            {!isEditing && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type="password"
                                            value={staff.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={staff.confirmPassword}
                                            onChange={handleChange}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            required
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default StaffForm