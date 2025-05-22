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
import {deleteProductGallery, getProductGallerys} from "../../services/productGalleryService.js";

const ProductGallery = () => {
  const navigate = useNavigate()
  const [productGallery, setProductGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProductGallery, setSelectedProductGallery] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionAnchor, setActionAnchor] = useState(null)
  
  // Fetch productGallery data
  const fetchProductGallery = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we're using mock data
      const data = await getProductGallerys()
      setProductGallery(data.data)
    } catch (error) {
      console.error('Error fetching productGallery:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchProductGallery()
  }, [])
  
  // Filter productGallery based on search term
  const filteredProductGallery = productGallery.filter((category) =>
    category.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.placeholder.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle actions menu
  const handleActionClick = (event, category) => {
    event.stopPropagation()
    setSelectedProductGallery(category)
    setActionAnchor(event.currentTarget)
  }
  
  const handleActionClose = () => {
    setActionAnchor(null)
  }
  
  // Handle category actions
  const handleViewProductGallery = () => {
    // In a real app, this would navigate to a category detail view
    handleActionClose()
  }
  
  const handleEditProductGallery = () => {
    navigate(`/product-gallery/edit/${selectedProductGallery.id}`)
    handleActionClose()
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleActionClose()
  }
  
  const handleDeleteConfirm = async () => {
    // In a real app, this would be an API call
    try {
      await deleteProductGallery(selectedProductGallery.id)
      setDeleteDialogOpen(false)
      await fetchProductGallery()
    } catch (e) {
      console.log(e)
    }

  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleAddProductGallery = () => {
    navigate('/product-gallery/new')
  }
  
  // DataGrid columns
  const columns = [
    {
      field: 'placeholder',
      headerName: 'Placeholder',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'thumbnail',
      headerName: 'Is Thumbnail',
      width: 120,
      renderCell: (params) => {
        const active = params.value
        return (
          <Chip 
            label={active ? 'True' : 'False'}
            color={active ? 'success' : 'error'}
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
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    },
  ]
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
          ProductGallery
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddProductGallery}
        >
          Add ProductGallery
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search productGallery..."
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
            treeData
            rows={filteredProductGallery}
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
        <MenuItem onClick={handleViewProductGallery}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility fontSize="small" />
            <Typography>View</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleEditProductGallery}>
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
        <DialogTitle>Delete ProductGallery</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{selectedProductGallery?.name}"? This will remove all associations with products.
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

export default ProductGallery