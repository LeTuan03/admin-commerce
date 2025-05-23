import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Divider,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const OrderDates = ({ orderId, initialDates, onSave, disabled }) => {
    const [dates, setDates] = useState({
        orderApprovedAt: '',
        orderDeliveredCarrierDate: '',
        orderDeliveredCustomerDate: '',
    });

    useEffect(() => {
        if (initialDates) {
            setDates({
                orderApprovedAt: initialDates.orderApprovedAt ? formatDateForInput(initialDates.orderApprovedAt) : '',
                orderDeliveredCarrierDate: initialDates.orderDeliveredCarrierDate ? formatDateForInput(initialDates.orderDeliveredCarrierDate) : '',
                orderDeliveredCustomerDate: initialDates.orderDeliveredCustomerDate ? formatDateForInput(initialDates.orderDeliveredCustomerDate) : '',
            });
        }
    }, [initialDates]);

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };

    const handleDateChange = (field) => (event) => {
        setDates({
            ...dates,
            [field]: event.target.value,
        });
    };

    const handleSubmit = () => {
        const formattedDates = {
            orderApprovedAt: dates.orderApprovedAt ? new Date(dates.orderApprovedAt).toISOString() : null,
            orderDeliveredCarrierDate: dates.orderDeliveredCarrierDate ? new Date(dates.orderDeliveredCarrierDate).toISOString() : null,
            orderDeliveredCustomerDate: dates.orderDeliveredCustomerDate ? new Date(dates.orderDeliveredCustomerDate).toISOString() : null,
        };

        onSave(formattedDates);
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Order Timeline
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Approved Date"
                        type="datetime-local"
                        fullWidth
                        value={dates.orderApprovedAt}
                        onChange={handleDateChange('orderApprovedAt')}
                        InputLabelProps={{ shrink: true }}
                        disabled={disabled}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Delivered to Carrier Date"
                        type="datetime-local"
                        fullWidth
                        value={dates.orderDeliveredCarrierDate}
                        onChange={handleDateChange('orderDeliveredCarrierDate')}
                        InputLabelProps={{ shrink: true }}
                        disabled={disabled}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Delivered to Customer Date"
                        type="datetime-local"
                        fullWidth
                        value={dates.orderDeliveredCustomerDate}
                        onChange={handleDateChange('orderDeliveredCustomerDate')}
                        InputLabelProps={{ shrink: true }}
                        disabled={disabled}
                        sx={{ mb: 2 }}
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={disabled}
                    sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Save Timeline
                </Button>
            </Box>
        </Paper>
    );
};

export default OrderDates;