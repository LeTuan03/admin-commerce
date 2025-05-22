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
  Divider,
  Chip,
  Avatar,
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
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { mockProducts } from '../../utils/mockData'
import { formatCurrency } from '../../utils/formatters'
import {deleteProduct, getProducts} from "../../services/productService.js";

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionAnchor, setActionAnchor] = useState(null)

  const fetchProducts = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we're using mock data
      const data = await getProducts();
      console.log(data.data)
      setProducts(data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }
  // Fetch products data
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget)
  }
  
  const handleFilterClose = () => {
    setFilterAnchor(null)
  }
  
  // Handle actions menu
  const handleActionClick = (event, product) => {
    event.stopPropagation()
    setSelectedProduct(product)
    setActionAnchor(event.currentTarget)
  }
  
  const handleActionClose = () => {
    setActionAnchor(null)
  }
  
  // Handle product actions
  const handleEditProduct = () => {
    navigate(`/products/edit/${selectedProduct.id}`)
    handleActionClose()
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleActionClose()
  }
  
  const handleDeleteConfirm = async () => {
    // In a real app, this would be an API call
    setProducts(products.filter((product) => product.id !== selectedProduct.id))
    try {
      await deleteProduct(selectedProduct.id);
      await fetchProducts();
    } catch (e) {
      console.error(e);
    }
    setDeleteDialogOpen(false)
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleAddProduct = () => {
    navigate('/products/new')
  }
  
  // DataGrid columns
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <Avatar 
          src={params.row.image} 
          alt={params.row.name} 
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 120,
    },
    {
      field: 'salePrice',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => formatCurrency(params?.row?.salePrice),
    },
    // {
    //   field: 'stock',
    //   headerName: 'Stock',
    //   width: 120,
    //   renderCell: (params) => {
    //     const stock = params.value
    //     let color = 'success'
    //     if (stock <= 5) color = 'error'
    //     else if (stock <= 15) color = 'warning'
    //
    //     return (
    //       <Chip
    //         label={stock}
    //         color={color}
    //         size="small"
    //         variant="outlined"
    //       />
    //     )
    //   },
    // },
    {
      field: 'type',
      headerName: 'Category',
      width: 150,
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 120,
    //   renderCell: (params) => {
    //     const status = params.value
    //     return (
    //       <Chip
    //         label={status}
    //         color={status === 'Active' ? 'success' : status === 'Draft' ? 'warning' : 'error'}
    //         size="small"
    //       />
    //     )
    //   },
    // },
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
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search products..."
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
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
            size="small"
          >
            Filters
          </Button>
        </Box>
        
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            loading={loading}
            autoPageSize
            checkboxSelection
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
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem>
          <Typography variant="subtitle2">Category</Typography>
        </MenuItem>
        <MenuItem dense>All Categories</MenuItem>
        <MenuItem dense>Electronics</MenuItem>
        <MenuItem dense>Clothing</MenuItem>
        <MenuItem dense>Home & Garden</MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="subtitle2">Status</Typography>
        </MenuItem>
        <MenuItem dense>All</MenuItem>
        <MenuItem dense>Active</MenuItem>
        <MenuItem dense>Draft</MenuItem>
        <MenuItem dense>Archived</MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="subtitle2">Stock</Typography>
        </MenuItem>
        <MenuItem dense>All</MenuItem>
        <MenuItem dense>In Stock</MenuItem>
        <MenuItem dense>Low Stock</MenuItem>
        <MenuItem dense>Out of Stock</MenuItem>
      </Menu>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => {
          navigate(`/products/edit/${selectedProduct?.id}`)
          handleActionClose()
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility fontSize="small" />
            <Typography>View</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleEditProduct}>
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
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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

export default Products