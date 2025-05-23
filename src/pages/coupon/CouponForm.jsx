import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Breadcrumbs,
    Link, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material'
import {
    ArrowBack,
    Save,
    NavigateNext,
} from '@mui/icons-material'
import {createCoupon, getCouponById, updateCoupon} from "../../services/couponService.js";
import {formatDateTimeBE} from "../../utils/formatters.js";

const CouponForm = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const isEditing = Boolean(id)

    // Form state
    const [coupon, setCoupon] = useState({
        code: '',
        discountValue: '',
        discountType: '',
        timesUsed: '',
        maxUsage: '',
        orderAmountLimit: '',
        couponStartDate: formatDateTimeBE(new Date()),
        couponEndDate: formatDateTimeBE(new Date()),
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)

    // Fetch coupon data if editing
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditing) {
                    // In a real app, this would be an API call with the coupon ID
                    // For now, we're using mock data
                    const data = await getCouponById(id);
                    setCoupon({
                        ...data.data,
                        couponStartDate: formatDateTimeBE(data.data.couponStartDate),
                        couponEndDate: formatDateTimeBE(data.data.couponEndDate)
                    });
                }
            } catch (error) {
                console.error('Error fetching coupon data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, isEditing])

    // Handle form changes
    const handleChange = (e) => {
        const {name, value, checked, type} = e.target
        setCoupon({
            ...coupon,
            [name]: type === 'checkbox' ? checked : value,
        })

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            })
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        if (!coupon.code.trim()) {
            newErrors.code = 'Coupon code is required'
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
            // In a real app, this would be an API call to save the coupon
            // For now, we'll just simulate success
            console.log('Saving coupon:', coupon)
            let payload = {
                code: coupon.code,
                discountValue: coupon.discountValue,
                discountType: coupon.discountType,
                timesUsed: coupon.timesUsed,
                maxUsage: coupon.maxUsage,
                orderAmountLimit: coupon.orderAmountLimit,
                couponStartDate: formatDateTimeBE(coupon.couponStartDate),
                couponEndDate: formatDateTimeBE(coupon.couponEndDate),
            }
            if (id) {
                await updateCoupon(id, payload)
            } else {
                await createCoupon(payload)
            }
            // Navigate back to coupon list after saving
            setTimeout(() => {
                navigate('/coupon')
            }, 1000)
        } catch (error) {
            console.error('Error saving coupon:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Typography>Loading coupon data...</Typography>
    }

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: 'medium', mb: 1}}>
                        {isEditing ? 'Edit Coupon' : 'Add New Coupon'}
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
                                navigate('/coupon')
                            }}
                        >
                            Coupons
                        </Link>
                        <Typography color="text.primary">
                            {isEditing ? 'Edit Coupon' : 'Add Coupon'}
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack/>}
                        onClick={() => navigate('/coupon')}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Save/>}
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Coupon'}
                    </Button>
                </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <Paper sx={{p: 3, borderRadius: 2, mb: coupon.valueType === 'Text' ? 3 : 0}}>
                    <Typography variant="h6" sx={{mb: 3}}>
                        Coupon Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Coupon code"
                                name="code"
                                value={coupon.code}
                                onChange={handleChange}
                                required
                                error={!!errors.code}
                                helperText={errors.code}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Discount Value"
                                name="discountValue"
                                value={coupon.discountValue}
                                onChange={handleChange}
                                required
                                error={!!errors.discountValue}
                                helperText={errors.discountValue}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/*<TextField*/}
                            {/*  fullWidth*/}
                            {/*  label="Discount Type"*/}
                            {/*  name="discountType"*/}
                            {/*  value={coupon.discountType}*/}
                            {/*  onChange={handleChange}*/}
                            {/*  required*/}
                            {/*  error={!!errors.discountType}*/}
                            {/*  helperText={errors.discountType}*/}
                            {/*/>*/}
                            <FormControl fullWidth>
                                <InputLabel>Discount Type</InputLabel>
                                <Select
                                    value={coupon.discountType}
                                    label="Discount Type"
                                    name="discountType"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="percent">Percent</MenuItem>
                                    <MenuItem value="fixed">Fixed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Times Used"
                                name="timesUsed"
                                value={coupon.timesUsed}
                                onChange={handleChange}
                                disabled={true}
                                error={!!errors.timesUsed}
                                helperText={errors.timesUsed}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max Usage"
                                name="maxUsage"
                                value={coupon.maxUsage}
                                onChange={handleChange}
                                required
                                error={!!errors.maxUsage}
                                helperText={errors.maxUsage}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Order Amount Limit"
                                name="orderAmountLimit"
                                value={coupon.orderAmountLimit}
                                onChange={handleChange}
                                required
                                error={!!errors.orderAmountLimit}
                                helperText={errors.orderAmountLimit}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Coupon Start Date"
                                name="couponStartDate"
                                value={coupon.couponStartDate}
                                onChange={handleChange}
                                required
                                error={!!errors.couponStartDate}
                                helperText={errors.couponStartDate}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Coupon End Date"
                                name="couponEndDate"
                                value={coupon.couponEndDate}
                                onChange={handleChange}
                                required
                                error={!!errors.couponEndDate}
                                helperText={errors.couponEndDate}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    )
}

export default CouponForm