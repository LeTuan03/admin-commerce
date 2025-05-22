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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import {deleteCoupon, getCoupons} from "../../services/couponService.js";
import {formatDateTimeBE} from "../../utils/formatters.js";

const Coupon = () => {
  const navigate = useNavigate()
  const [coupon, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionAnchor, setActionAnchor] = useState(null)
  
  // Fetch coupon data
  const fetchCoupons = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we're using mock data
      const data = await getCoupons()
      setCoupons(data.data)
    } catch (error) {
      console.error('Error fetching coupon:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])
  
  // Filter coupon based on search term
  const filteredCoupons = coupon.filter((attribute) =>
    attribute.code.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle actions menu
  const handleActionClick = (event, attribute) => {
    event.stopPropagation()
    setSelectedCoupon(attribute)
    setActionAnchor(event.currentTarget)
  }
  
  const handleActionClose = () => {
    setActionAnchor(null)
  }
  
  // Handle attribute actions
  const handleViewCoupon = () => {
    // In a real app, this would navigate to an attribute detail view
    navigate(`/coupon/edit/${selectedCoupon.id}`)
    handleActionClose()
  }
  
  const handleEditCoupon = () => {
    navigate(`/coupon/edit/${selectedCoupon.id}`)
    handleActionClose()
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleActionClose()
  }
  
  const handleDeleteConfirm = async () => {
    // In a real app, this would be an API call
    try {
      await deleteCoupon(selectedCoupon.id)
      setDeleteDialogOpen(false)
      await fetchCoupons()
    } catch (e) {
      console.log(e)
    }
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleAddCoupon = () => {
    navigate('/coupon/new')
  }
  
  // DataGrid columns
  const columns = [
    {
      field: 'code',
      headerName: 'Coupon Name',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'couponEndDate',
      headerName: 'Coupon End Date  ',
      flex: 1,
      minWidth: 180,
      renderCell: (params) =>  formatDateTimeBE(params.value),
    },
    {
      field: 'couponStartDate',
      headerName: 'Coupon Start Date  ',
      flex: 1,
      minWidth: 180,
      renderCell: (params) =>  formatDateTimeBE(params.value),
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
          Coupons
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCoupon}
        >
          Add Coupon
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search coupon..."
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
        
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={filteredCoupons}
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
        <MenuItem onClick={handleViewCoupon}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility fontSize="small" />
            <Typography>View</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleEditCoupon}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Edit fontSize="small" />
            <Typography>Edit</Typography>
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
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the attribute "{selectedCoupon?.name}"? This will remove it from all products that use it.
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

export default Coupon